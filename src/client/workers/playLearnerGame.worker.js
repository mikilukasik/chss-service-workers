import { getMovedBoard } from '../../../chss-module-engine/src/engine_new/utils/getMovedBoard';
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import { board2fen } from '../../../chss-module-engine/src/engine_new/transformers/board2fen';
import { moveInBoard } from '../../../chss-module-engine/src/engine/engine';
import { GameModel } from '../../../chss-module-engine/src/model/Game';
import { getPieceBalance } from '../../../chss-module-engine/src/engine_new/utils/getPieceBalance';

import { msgClient as msg } from '../../../msg/src/client';

export const playModelGameHandler = [
  'playModelGame',
  async (task, comms) => {
    const {
      params: { startingFen, black, white },
      _id,
    } = task;
    const started = Date.now();
    const gameStats = await autoPlayTournamentGame({ startingFen, black, white });

    console.log(JSON.stringify({ gameStats, took: `${((Date.now() - started) / 1000).toFixed(2)}s` }, null, 2));

    comms.send({ _id, result: gameStats });
  },
];

const learnerSocket = msg.ws(`ws://${self.location.hostname}:3300/learnerSocket`);
learnerSocket.on(...playModelGameHandler);

learnerSocket.on('init', (data, comms) => {
  console.log('initializing..');
  comms.send({ success: true });
});

// importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs');

self.window = self;

setWasmPaths('wasm_bin/');

let wasmInited = false;
const ensureWasm = async () => {
  if (!wasmInited)
    await tf.setBackend('wasm').then((success) => {
      wasmInited = success;
      console.log(`wasm init success: ${success}`);
    }, console.error);
};

const models = {};
const modelsLoading = {};
const getModelResolvers = {};

const loadTransform = async (modelName) => {
  const transformAsString = await (
    await fetch(
      `http://${typeof window === 'undefined' || window.location.hostname}:3300/models/${modelName}/transform.js`,
    )
  ).text();

  const code = `(() => {${transformAsString.replace('module.exports =', 'return ')}})()`;
  return eval(code);
};

const loadConstants = async (modelName) => {
  return await (
    await fetch(
      `http://${typeof window === 'undefined' || window.location.hostname}:3300/models/${modelName}/constants.json`,
    )
  ).json();
};

const loadTfModel = async (modelName) => {
  console.log(`Loading model ${modelName}`);
  return tf.loadLayersModel(
    `http://${typeof window === 'undefined' || window.location.hostname}:3300/models/${modelName}/model.json`,
  );
};

const loadModel = async (name) => {
  const [model, transform, constants] = await Promise.all([
    loadTfModel(name),
    loadTransform(name),
    loadConstants(name),
  ]).catch(console.error);
  models[name] = { model, transform, constants };
  console.log(`tf model ${name} loaded`);

  while (getModelResolvers[name].length) getModelResolvers[name].pop()(models[name]);
};

const getModel = (_name) => {
  const name = _name.replace(/-dot-/g, '.').replace(/-dollar-/g, '$');

  return new Promise((r) => {
    if (models[name]) return r(models[name]);
    getModelResolvers[name] = (getModelResolvers[name] || []).concat(r);

    if (!modelsLoading[name]) {
      modelsLoading[name] = true;
      loadModel(name);
    }
  });
};

export const getPrediction = async ({ modelName, board, repeatedPastFens = [], noLoop = false }) => {
  const {
    model,
    transform,
    constants: { castlingIndex, enPassantIndex, inputLength, needsWNext },
  } = await getModel(modelName);

  let fenStr = board2fen(board);
  let needsInverseOutput = false;
  if (needsWNext) {
    const { fen, mirrored } = transform.getWhiteNextFen({ fen: fenStr });
    fenStr = fen;
    needsInverseOutput = mirrored;
  }

  if (noLoop && repeatedPastFens.length && repeatedPastFens.includes(fenStr)) {
    return null;
  }

  const inputTensor = tf.tensor(transform.fen2flatArray({ fenStr, castlingIndex, enPassantIndex }), [
    1,
    8,
    8,
    inputLength,
  ]);
  const outputTensor = model.predict(inputTensor);

  // console.log({ modelName, needsInverseOutput });

  let output = (await outputTensor.data())[0]; //+ randomValue * Math.random();
  if (needsInverseOutput) output *= -1;

  inputTensor.dispose();
  outputTensor.dispose();

  return output;
};

const indexOfMaxValue = (array) => array.reduce((iMax, x, i, arr) => (x !== null && x > arr[iMax] ? i : iMax), 0);
const indexOfMinValue = (array) => array.reduce((iMin, x, i, arr) => (x !== null && x < arr[iMin] ? i : iMin), 0);

const makeMove = async ({ game, modelName }) => {
  const { nextMoves, wNext, board, repeatedPastFens } = game;
  if (!nextMoves.length) {
    return { finished: true };
  }

  const weights = [0, -1, -3.33, -3.05, -5.63, -9.5, -20, 0, 0, 1, 3.33, 3.05, 5.63, 9.5, 20].map((w) => w / 50);

  const predict = (move) => {
    const movedBoard = getMovedBoard(move, board);
    return getPrediction({ modelName, board: movedBoard, repeatedPastFens, noLoop: true }).then((pred) => {
      const pawnMoved = (board[move >>> 10] & 7) === 1;
      const targetIndex = move & 63;
      const promoted = pawnMoved && (targetIndex >= 56 || targetIndex <= 7);
      return (
        pred +
        weights[board[targetIndex] & 15] +
        (promoted ? weights[movedBoard[targetIndex]] - weights[board[move >>> 10]] : 0)
      );
    });
  };

  const predictions = await Promise.all(nextMoves.map(predict));

  const moveindex = wNext ? indexOfMaxValue(predictions) : indexOfMinValue(predictions);
  const move = nextMoves[moveindex];
  const nextGameState = moveInBoard(move, game);
  // console.log(game.thinkingTimes);
  return { nextGameState };
};

const checkIfDraw = (game) => {
  const { allPastFens, board } = game;

  // check if looped
  const lastFen = allPastFens[allPastFens.length - 1];
  if (allPastFens.filter((f) => f === lastFen).length > 3) {
    game.isDraw = true;
    return true;
  }

  // check if there are pieces other than kings and knights
  for (let i = 0; i < 64; i += 1) {
    const pieceWithoutColor = board[i] & 7;
    if (![0, 6, 3].includes(pieceWithoutColor)) return false;
  }

  game.isDraw = true;
  return true;
};

const getGameStats = ({ game: { whiteWon, blackWon, allPastFens, bName, wName }, startingFen }) => {
  const result = whiteWon ? 1 : blackWon ? -1 : 0;
  const finalFen = allPastFens[allPastFens.length - 1];
  const pieceBalance = getPieceBalance({ fen: finalFen });
  return {
    result,
    pieceBalance,
    finalFen,
    blackWon,
    whiteWon,
    bName,
    wName,
    startingFen,
    moves: allPastFens.length - 1,
  };
};

export const autoPlayTournamentGame = async ({ startingFen, black, white }) => {
  await ensureWasm();

  const game = new GameModel({ fen: startingFen, bName: black, wName: white });
  let thisGame = Object.assign({}, game);

  const move = async () => {
    const { nextGameState, finished } = await makeMove({
      game: thisGame,
      modelName: thisGame.wNext ? thisGame.wName : thisGame.bName,
    });

    if (finished || checkIfDraw(nextGameState)) {
      const gameToReport = nextGameState || thisGame;
      if (!(gameToReport.whiteWon || gameToReport.blackWon || gameToReport.isDraw)) throw 'hiba';

      return getGameStats({ game: gameToReport, startingFen });
    }

    thisGame = nextGameState;

    await new Promise((r) => setTimeout(r, 0));

    return move();
  };

  return move();
};

ensureWasm();

const onmessageHandlers = {
  autoPlayTournamentGame,
};

onmessage = async (event) => {
  const handler = onmessageHandlers[event.data.command];
  postMessage({ command: 'autoPlayTournamentGame:result', data: await handler(event.data.data) });
};

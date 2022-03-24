import { getMovedBoard } from '../../../chss-module-engine/src/engine_new/utils/getMovedBoard';
import * as tf from '@tensorflow/tfjs';
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm';
import { board2fen } from '../../../chss-module-engine/src/engine_new/transformers/board2fen';
import { moveInBoard } from '../../../chss-module-engine/src/engine/engine';
import { GameModel } from '../../../chss-module-engine/src/model/Game';
import { getPieceBalance } from '../../../chss-module-engine/src/engine_new/utils/getPieceBalance';

import { msgClient as msg } from '../../../msg/src/client';

export const init = ({ backend = 'wasm' } = {}) => {
  console.log(`initializing tfjs, will try to use backend: ${backend}`);

  let models = {};
  let modelsLoading = {};
  const getModelResolvers = {};

  const resetModels = () => {
    Object.keys(models).forEach((name) => models[name].model.dispose());
    models = {};
    modelsLoading = {};
    tf.disposeVariables();
  };

  const learnerSocket = msg.ws(`ws://${self.location.hostname}:3300/learnerSocket`);

  learnerSocket.on('playModelGame', async ({ params: { startingFen, black, white, collectLessonFor }, _id }, comms) => {
    tf.engine().startScope();

    const gameStats = await autoPlayTournamentGame({ startingFen, black, white, collectLessonFor });
    comms.send({ _id, result: gameStats });

    console.log(`Tensors in memory before: ${tf.memory().numTensors}`);
    resetModels();
    tf.engine().endScope();
    console.log(`Tensors in memory after: ${tf.memory().numTensors}`);
  });

  learnerSocket.on('init', (data, comms) => {
    console.log('initializing');
    comms.send({ success: true });
  });

  self.window = self;
  if (backend === 'wasm') setWasmPaths('wasm_bin/');

  let wasmInited = false;
  const ensureWasm = async () => {
    if (!wasmInited && backend === 'wasm')
      await tf.setBackend('wasm').then((success) => {
        wasmInited = success;
        console.log(`wasm init success: ${success}`);
        // console.log(`Using backenf: ${tf.getBackend()}`);
      }, console.error);
  };

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
    // console.log(`Loading model ${modelName}`);
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

    while (getModelResolvers[name].length) getModelResolvers[name].pop()(models[name]);
  };

  const getModel = (_name) => {
    const name = _name.replace(/-dot-/g, '.').replace(/-dollar-/g, '$');

    return new Promise((r) => {
      if (models[name]) {
        return r(models[name]);
      }

      getModelResolvers[name] = (getModelResolvers[name] || []).concat(r);

      if (!modelsLoading[name]) {
        modelsLoading[name] = true;
        loadModel(name);
      }
    });
  };

  const getPrediction = async ({ modelName, board, repeatedPastFens = [], noLoop = false }) => {
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

    let output = (await outputTensor.data())[0];
    if (needsInverseOutput) output *= -1;

    inputTensor.dispose();
    outputTensor.dispose();

    return output;
  };

  const indexOfMaxValue = (array) => array.reduce((iMax, x, i, arr) => (x !== null && x > arr[iMax] ? i : iMax), 0);
  const indexOfMinValue = (array) => array.reduce((iMin, x, i, arr) => (x !== null && x < arr[iMin] ? i : iMin), 0);

  const makeMove = async ({ game, modelName }) => {
    const { nextMoves, wNext, board, repeatedPastFens, allPastFens } = game;
    if (!nextMoves.length) {
      return { finished: true };
    }

    const weights = [0, -1, -3.33, -3.05, -5.63, -9.5, -20, 0, 0, 1, 3.33, 3.05, 5.63, 9.5, 20].map((w) => w / 50);

    const predict = (move) => {
      // to avoid repeated games and overfitting
      // if (allPastFens.length < 6) return Promise.resolve(Math.random());

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

  const smoothen = (arr) => {
    const smoothArr = arr.slice();

    let i = 0;
    while (i++ < arr.length - 2) {
      if (Math.abs(arr[i - 1] - arr[i + 1]) < 75) smoothArr[i] = (arr[i - 1] + arr[i + 1]) / 2;
    }

    return smoothArr;
  };

  const getBalanceScore = ({ result: _result, balancesAhead: _balancesAhead, mirrored, completed }) => {
    const balancesAhead = mirrored ? _balancesAhead.map((x) => -x) : _balancesAhead.slice();
    const result = _result * (mirrored ? -1 : 1);

    const balanceDiffsAhead = balancesAhead.map((bal) => bal - balancesAhead[0]);

    const balanceFiller = balanceDiffsAhead[balanceDiffsAhead.length - 1] + result * 2500; // TODO: this should be model specific
    // result === 0 && completed ? 0 : balanceDiffsAhead[balanceDiffsAhead.length - 1] + result * 1000;

    const extendedArr = balanceDiffsAhead.concat(Array(16).fill(balanceFiller)).slice(2); // TODO: this should be model specific
    const smootherBalancesArray = smoothen(extendedArr);

    return smootherBalancesArray.reduce((p, c, i) => p + c / Math.pow(1.25, i), 0) / 25000;
  };

  const getLessons = async ({
    game: { allPastFens, wName, bName },
    collectLessonFor,
    stats: { result },
    completed,
    logWholeGame,
  }) => {
    const balances = allPastFens.map((fen) => Math.round(getPieceBalance({ fen }) * 100));

    const records = allPastFens.map((fen, index) => {
      const wNext = fen.split(' ')[1] === 'w';
      const balance = balances[index];
      return {
        fen,
        result,
        wNext, //: fen.split(' ')[1] === 'w',
        endsWithMate: result !== 0,
        isMate: result !== 0 && index === allPastFens.length - 1,
        balance,
        // wNextBalance: wName ? balance : balance * -1,
        balancesAhead: balances.slice(index),
        isStall: result === 0 && completed && index === allPastFens.length - 1,
      };
    });

    const lessons = [];

    // for (const modelName of collectLessonFor) {
    const {
      model,
      transform,
      constants: { castlingIndex, enPassantIndex, inputLength },
    } = await getModel(collectLessonFor);

    for (const [rIndex, record] of records.entries()) {
      const { fen: _fen, result, balancesAhead } = record;
      const { fen, mirrored } = transform.getWhiteNextFen({ fen: _fen });

      const actual = getBalanceScore({ result, balancesAhead, mirrored, completed });

      // const xs = transform.fen2flatArray({ fenStr: fen, inputLength, castlingIndex, enPassantIndex });
      // const inputTensor = tf.tensor(xs, [1, 8, 8, inputLength]);
      // const outputTensor = model.predict(inputTensor);
      // const predicted = (await outputTensor.data())[0];

      // const ys = [actual > predicted ? (actual + predicted * 4) / 5 : actual];

      const whiteInTraining = wName === collectLessonFor;

      const inTrainingLost = (whiteInTraining && result === -1) || (!whiteInTraining && result === 1);

      const inTrainingMoved =
        (whiteInTraining && _fen.split(' ')[1] === 'b') || (!whiteInTraining && _fen.split(' ')[1] === 'w');

      const willLearnRecord =
        rIndex >= records.length - 1 ||
        (inTrainingLost &&
          inTrainingMoved &&
          Math.abs(actual) >= 0.1 &&
          // (rIndex + 4 > balances.length ||
          // actual <= -0.02 &&
          (rIndex + 6 > balances.length ||
            (whiteInTraining && balances[rIndex + 6] < balances[rIndex]) ||
            (!whiteInTraining && balances[rIndex + 6] > balances[rIndex])));
      //|| actual >= 0.2);
      // inTrainingMoved && (actual < -0.3 || actual > -0.4);

      // (whiteInTraining && balances[rIndex + 4] < balances[rIndex]) ||
      // (!whiteInTraining && balances[rIndex + 4] > balances[rIndex]));

      // // console.log(inTrainingMoved);

      // if (inTrainingMoved && didMakeBadMove)
      if (willLearnRecord)
        lessons.push({
          xsParams: { fenStr: fen, inputLength, castlingIndex, enPassantIndex },
          ys: [actual],
        });

      if (logWholeGame) console.log(_fen, actual * (mirrored ? -1 : 1));
    }
    // }

    // const lastLesson = lessons[lessons.length - 1].lesson;

    // lessons.sort((a, b) => a.actual - b.actual);

    return lessons;
    // .slice(0, lessons.length / 20)
    // .map(({ lesson }) => lesson)
    // .concat(lastLesson);
  };

  const getGameStats = async ({ game, startingFen, collectLessonFor, completed }) => {
    const { whiteWon, blackWon, allPastFens, bName, wName } = game;
    const result = whiteWon ? 1 : blackWon ? -1 : 0;
    const finalFen = allPastFens[allPastFens.length - 1];
    const pieceBalance = getPieceBalance({ fen: finalFen });

    const stats = {
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

    if (collectLessonFor)
      stats.lessons = await getLessons({
        game,
        collectLessonFor,
        stats,
        completed,
        logWholeGame: false, //blackWon || whiteWon,
      });

    return stats;
  };

  const autoPlayTournamentGame = async ({ startingFen, black, white, collectLessonFor }) => {
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

        return await getGameStats({ game: gameToReport, startingFen, collectLessonFor, completed: finished });
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

  return { autoPlayTournamentGame };
};

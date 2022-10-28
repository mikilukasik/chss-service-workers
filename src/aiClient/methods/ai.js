// import { getMoveEvaluator } from '../../../../chss-module-engine/src/engine_new/moveGenerators/getMoveEvaluator_new.js';
import { minimax as minimaxJs } from '../../../../chss-module-engine/src/engine_new/minimax/minimaxTopLevel.js';
import { move2moveString } from '../../../../chss-module-engine/src/engine_new/transformers/move2moveString.js';
// import { getMovedBoard as getMovedBoardJs } from '../../../../chss-module-engine/src/engine_new/utils/getMovedBoard.js';
import { getWasmEngine } from '../../../../chss-module-engine/src/engine_new/utils/wasmEngine.js';
import { getBoardPieceBalance } from '../../../../chss-module-engine/src/engine_new/utils/getBoardPieceBalance.js';
import { getPrediction } from '../../../../chss-module-engine/src/engine_new/tfModels/modelLoader';
import { msgClient } from '../../../msg/src/client';
import { getUpdatedLmfLmt } from '../../../../chss-module-engine/src/engine_new/utils/getUpdatedLmfLmt.js';

const cutoff = 0.001; //15;

const predictionSocket = msgClient.ws(`ws://${self.location.hostname}:3300/predictionSocket`);

// import { getPredictionV2 } from '../tfModels/getPredictionV2.js';

// const MODEL_NAME = 'moves_0.02679-e1-1652876197395';
// const modelName = 'pg_SL';
const modelName = 'pg_large';
const d1ModelName = 'pg_small';
const d2ModelName = 'pg_tiny';

export const getMoveEvaluator = async ({ game }) => {
  // const prediction = await getPredictionV2({ board, modelName: MODEL_NAME });

  // const predictionSocket = await getPredictionSocket();
  const response = await predictionSocket.do('predictMove', { game, modelName });

  // console.log({ response });

  const moveEvaluator = (move) => {
    // const sourceIndex = move >>> 10;
    // const targetIndex = move & 63;

    return response.moveValues[move]; // * 1.4 + prediction[targetIndex + 64];
  };

  return moveEvaluator;
};

const localSingleThread = async ({ depth, game }) => {
  // console.log('hello');
  if (depth < 1) return;
  const { nextMoves, board, lmf, lmt } = game;

  const wantsToDraw = board[64] ? getBoardPieceBalance(board) < 0 : getBoardPieceBalance(board) > 0;

  // let ix = 1;
  const deepMoveSorters = [
    { predict: (arg) => getPrediction({ ...arg, modelName: d1ModelName }), cutoff: 0.042 },
    { predict: (arg) => getPrediction({ ...arg, modelName: d2ModelName }), cutoff: 0.042 },
    // { predict: (arg) => getPrediction({ ...arg, modelName: d2ModelName }), cutoff: 0.02 },
  ];

  // const deepMoveSorters = [];

  const { getMovedBoard } = await getWasmEngine();

  const started = Date.now();

  const moveEvaluator = await getMoveEvaluator({ game });
  const moveAiValues = nextMoves.map(moveEvaluator);

  const sortedMoves = new Array(nextMoves.length)
    .fill(0)
    .map((e, i) => i)
    .filter((i) => moveAiValues[i] >= moveAiValues[0] * (cutoff || 0))
    .sort((a, b) => moveAiValues[b] - moveAiValues[a])
    .map((i) => nextMoves[i]);

  let winningMove;
  // let winningMoves = [];
  let pieceValue;

  if (board[64]) {
    let value = -999999;

    for (const move of sortedMoves) {
      // const deepMoveSorters = [
      //   (arg) => console.log(ix++, move2moveString(move)) || getPrediction({ ...arg, modelName: d1ModelName }),
      // ];

      const moveAiValue = moveEvaluator(move); // / 3;
      const movedBoard = getMovedBoard(move, board);
      const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

      // const [, nmVal /*, ..._winningMoves*/] = minimax(movedBoard, depth - 1, value, 999999, moveAiValue);
      const nmVal = await minimaxJs(
        movedBoard,
        depth - 1,
        value,
        999999,
        moveAiValue,
        deepMoveSorters,
        nextLm.lmf,
        nextLm.lmt,
        wantsToDraw,
      );
      // console.log({ nmVal, moveAiValue });
      if (nmVal > value) {
        value = nmVal;
        pieceValue = nmVal - moveAiValue;
        winningMove = move;
        // winningMoves = [move, ..._winningMoves];
      }
    }

    return {
      value,
      pieceValue,
      move: winningMove,
      // winningMoves,
      // winningMoveStrs: winningMoves.map(move2moveString),
      moveStr: move2moveString(winningMove),
      ms: Date.now() - started,
    };
  }

  let value = 999999;
  // let winningMove;
  // let winningMoves;

  for (const move of sortedMoves) {
    // const deepMoveSorters = [
    //   (arg) => console.log(ix++, move2moveString(move)) || getPrediction({ ...arg, modelName: d1ModelName }),
    // ];

    const moveAiValue = moveEvaluator(move) * -1; // / -3;
    const movedBoard = getMovedBoard(move, board);
    const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

    // const [, nmVal /*, ..._winningMoves*/] = minimax(movedBoard, depth - 1, -999999, value, moveAiValue);
    const nmVal = await minimaxJs(
      movedBoard,
      depth - 1,
      -999999,
      value,
      moveAiValue,
      deepMoveSorters,
      nextLm.lmf,
      nextLm.lmt,
      wantsToDraw,
    );

    if (nmVal < value) {
      value = nmVal;
      pieceValue = nmVal - moveAiValue;
      winningMove = move;
      // winningMoves = [move, ..._winningMoves];
    }
  }

  return {
    value,
    pieceValue,
    move: winningMove,
    // winningMoves,
    // winningMoveStrs: winningMoves.map(move2moveString),
    moveStr: move2moveString(winningMove),
    ms: Date.now() - started,
  };
};

const methods = { localSingleThread };

export const ai = async ({ method, game, depth = 4 }) => methods[method]({ game, depth });

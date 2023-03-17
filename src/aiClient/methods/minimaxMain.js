import { evaluateBoard } from '../../../chss-module-engine/src/engine_new/evaluators/evaluateBoard_new.js';
import { generatePseudoMovesThrowMethod } from '../../../chss-module-engine/src/engine_new/moveGenerators/generatePseudoMovesThrowMethod.js';
import { getUpdatedLmfLmt } from '../../../chss-module-engine/src/engine_new/utils/getUpdatedLmfLmt.js';
import { getWasmEngine } from '../../../chss-module-engine/src/engine_new/utils/wasmEngine.js';
import { getMovedBoard } from '../../../chss-module-engine/src/engine_new/utils/getMovedBoard.js';
import { isCaptured } from '../../../chss-module-engine/src/engine_new/utils/isCaptured.js';
import { getPrediction } from '../../../chss-module-engine/src/engine_new/tfModels/modelLoader.js';
import { doOnSubWorker } from './connectSubWorker.js';

export const mainWorkerTopLevelAlphaBetaSetters = {};

const getMoveEvaluator = async ({ board, lmf, lmt, predict }) => {
  const response = await predict({ game: { board, lmf, lmt, wNext: board[64] } });

  const moveEvaluator = (move) => response.moveValues[move]; // * 1.4 + prediction[targetIndex + 64];
  return moveEvaluator;
};

export const minimaxMain = async (
  { board, depth, alpha, beta, valueToAdd = 0, deepMoveSorters = [], lmf, lmt, wantsToDraw },
  id,
  // { updateGlobalAlpha = () => {}, updateGlobalBeta = () => {} } = {},
) => {
  // console.log('jonapot', { board, depth, alpha, beta, valueToAdd, deepMoveSorters, lmf, lmt, wantsToDraw, id });

  let aborted = false;

  if (id) {
    mainWorkerTopLevelAlphaBetaSetters[id] = {
      setAlpha: (incomingAlpha) => {
        // console.log('mainA', incomingAlpha);
        alpha = Math.max(alpha, incomingAlpha);
      },
      setBeta: (incomingBeta) => {
        // console.log('mainB', incomingBeta);
        beta = Math.min(beta, incomingBeta);
      },
      abort: () => {
        aborted = true;
      },
    };
  }

  if (deepMoveSorters.length === 0) {
    const [error, val] = await (await getWasmEngine()).minimax(board, depth, alpha, beta, valueToAdd);
    if (error) throw false;

    delete mainWorkerTopLevelAlphaBetaSetters[id];
    return val;
  }

  if (depth === 0) {
    delete mainWorkerTopLevelAlphaBetaSetters[id];
    return evaluateBoard(board) + valueToAdd;
  }

  const moves = generatePseudoMovesThrowMethod(board);

  const moveEvaluator = await getMoveEvaluator({
    board,
    lmf,
    lmt,
    predict: (arg) => getPrediction({ ...arg, ...deepMoveSorters[0] }),
  });
  const moveAiValues = moves.map(moveEvaluator);
  const _sortedMoves = new Array(moves.length)
    .fill(0)
    .map((e, i) => i)
    .sort((a, b) => moveAiValues[b] - moveAiValues[a]);

  const sortedMoves = _sortedMoves
    .filter((i) => moveAiValues[i] >= moveAiValues[_sortedMoves[0]] * (deepMoveSorters[0].cutoff || 0))
    .map((i) => moves[i]);

  const minimaxParams = [];
  const activeSubWorkers = {};

  const instructBusyWorkers = (cmd, data) => {
    // console.log('ujujuj', Object.keys(activeSubWorkers));
    Object.keys(activeSubWorkers).forEach((id) => {
      activeSubWorkers[id].worker.port.postMessage({ cmd, data, id });
    });
  };

  if (board[64]) {
    let value = -99999 - depth;

    await Promise.all(
      sortedMoves.map((move) => {
        // if (aborted) break;

        const movedBoard = getMovedBoard(move, board);
        // try {
        const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

        const params = {
          board: movedBoard,
          depth: depth - 1,
          alpha: alpha,
          beta: beta,
          valueToAdd: valueToAdd,
          deepMoveSorters: deepMoveSorters.slice(1),
          lmf: nextLm.lmf,
          lmt: nextLm.lmt,
          wantsToDraw: wantsToDraw,
        };
        minimaxParams.push(params);

        return doOnSubWorker('minimax', params, ({ worker, id: sId, abort }) => {
          activeSubWorkers[sId] = { worker, abort };
          // console.log('asl', Object.keys(activeSubWorkers).length);
          if (aborted) {
            // console.log('aborting in main');
            abort();
          }
        })
          .then(({ data, id: sId }) => {
            delete activeSubWorkers[sId];

            value = Math.max(value, data);

            if (value >= beta) {
              instructBusyWorkers('abort');
              throw false;
            }

            if (value > alpha) {
              // updateGlobalBeta(value);
              alpha = value;
              minimaxParams.forEach((param) => (param.alpha = value));
              instructBusyWorkers('setAlpha', value);
            }
          })
          .catch((e) => {
            delete mainWorkerTopLevelAlphaBetaSetters[id];
            if (e) throw e;
          });
        // } catch (e) {

        // }
      }),
    );

    if (
      !wantsToDraw &&
      value === -99999 - depth &&
      !isCaptured(board, board.indexOf(6 + (board[64] << 3)), board[64])
    ) {
      delete mainWorkerTopLevelAlphaBetaSetters[id];
      return 99999;
    }
    delete mainWorkerTopLevelAlphaBetaSetters[id];

    return value;
  }

  let value = 99999 + depth;

  await Promise.all(
    sortedMoves.map((move) => {
      //    if (aborted) break;

      const movedBoard = getMovedBoard(move, board);
      // try {
      const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

      const params = {
        board: movedBoard,
        depth: depth - 1,
        alpha: alpha,
        beta: beta,
        valueToAdd: valueToAdd,
        deepMoveSorters: deepMoveSorters.slice(1),
        lmf: nextLm.lmf,
        lmt: nextLm.lmt,
        wantsToDraw: wantsToDraw,
      };

      minimaxParams.push(params);

      return doOnSubWorker('minimax', params, ({ worker, id: sId, abort }) => {
        activeSubWorkers[sId] = { worker, abort };
        // console.log('asl', Object.keys(activeSubWorkers).length);
        if (aborted) {
          // console.log('aborting in main');
          abort();
          // instructBusyWorkers('abort');
        }
      })
        .then(({ data, id: sId }) => {
          delete activeSubWorkers[sId];

          value = Math.min(value, data);

          if (value <= alpha) {
            instructBusyWorkers('abort');
            throw false;
          }

          if (value < beta) {
            // updateGlobalAlpha(value);
            beta = value;
            minimaxParams.forEach((param) => (param.beta = value));
            instructBusyWorkers('setBeta', value);
          }
        })
        .catch((e) => {
          delete mainWorkerTopLevelAlphaBetaSetters[id];
          if (e) throw e;
        });
    }),
  );

  if (!wantsToDraw && value === 99999 + depth && !isCaptured(board, board.indexOf(6 + (board[64] << 3)), board[64])) {
    delete mainWorkerTopLevelAlphaBetaSetters[id];
    return -99999;
  }

  delete mainWorkerTopLevelAlphaBetaSetters[id];
  return value;
};

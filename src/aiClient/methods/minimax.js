import { evaluateBoard } from '../../../chss-module-engine/src/engine_new/evaluators/evaluateBoard_new.js';
import { generatePseudoMovesThrowMethod } from '../../../chss-module-engine/src/engine_new/moveGenerators/generatePseudoMovesThrowMethod.js';
import { getUpdatedLmfLmt } from '../../../chss-module-engine/src/engine_new/utils/getUpdatedLmfLmt.js';
import { getWasmEngine } from '../../../chss-module-engine/src/engine_new/utils/wasmEngine.js';
import { getMovedBoard } from '../../../chss-module-engine/src/engine_new/utils/getMovedBoard.js';
import { isCaptured } from '../../../chss-module-engine/src/engine_new/utils/isCaptured.js';
import { getPrediction } from '../../../chss-module-engine/src/engine_new/tfModels/modelLoader.js';

export const subWorkerTopLevelAlphaBetaSetters = {};

const getMoveEvaluator = async ({ board, lmf, lmt, predict }) => {
  const response = await predict({ game: { board, lmf, lmt, wNext: board[64] } });

  const moveEvaluator = (move) => response.moveValues[move]; // * 1.4 + prediction[targetIndex + 64];
  return moveEvaluator;
};

export const minimax = async (
  { board, depth, alpha, beta, valueToAdd = 0, deepMoveSorters = [], lmf, lmt, wantsToDraw },
  id,
) => {
  if (id) {
    subWorkerTopLevelAlphaBetaSetters[id] = {
      setAlpha: (incomingAlpha) => {
        alpha = Math.max(alpha, incomingAlpha);
      },
      setBeta: (incomingBeta) => {
        beta = Math.min(beta, incomingBeta);
      },
    };
  }

  if (deepMoveSorters.length === 0) {
    const [error, val] = await (await getWasmEngine()).minimax(board, depth, alpha, beta, valueToAdd);
    if (error) throw false;

    delete subWorkerTopLevelAlphaBetaSetters[id];
    return val;
  }

  if (depth === 0) {
    delete subWorkerTopLevelAlphaBetaSetters[id];
    return evaluateBoard(board) + valueToAdd;
  }

  const moves = generatePseudoMovesThrowMethod(board);
  const _movesss = JSON.stringify(moves);
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

  if (board[64]) {
    let value = -99999 - depth;

    if (sortedMoves.length === 0) console.log({ m: moves.map((e) => e), s: sortedMoves.map((e) => e), _movesss });

    for (const move of sortedMoves) {
      const movedBoard = getMovedBoard(move, board);
      try {
        const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

        value = Math.max(
          value,
          await minimax({
            board: movedBoard,
            depth: depth - 1,
            alpha: alpha,
            beta: beta,
            valueToAdd: valueToAdd,
            deepMoveSorters: deepMoveSorters.slice(1),
            lmf: nextLm.lmf,
            lmt: nextLm.lmt,
            wantsToDraw: wantsToDraw,
          }),
        );

        if (value >= beta) break;
        alpha = Math.max(alpha, value);
      } catch (e) {
        delete subWorkerTopLevelAlphaBetaSetters[id];
        if (e) throw e;
      }
    }

    if (
      !wantsToDraw &&
      value === -99999 - depth &&
      !isCaptured(board, board.indexOf(6 + (board[64] << 3)), board[64])
    ) {
      delete subWorkerTopLevelAlphaBetaSetters[id];
      return 99999;
    }
    delete subWorkerTopLevelAlphaBetaSetters[id];

    return value;
  }

  let value = 99999 + depth;

  for (const move of sortedMoves) {
    const movedBoard = getMovedBoard(move, board);
    try {
      const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });
      value = Math.min(
        value,
        await minimax({
          board: movedBoard,
          depth: depth - 1,
          alpha: alpha,
          beta: beta,
          valueToAdd: valueToAdd,
          deepMoveSorters: deepMoveSorters.slice(1),
          lmf: nextLm.lmf,
          lmt: nextLm.lmt,
          wantsToDraw: wantsToDraw,
        }),
      );

      if (value <= alpha) break;
      beta = Math.min(beta, value);
    } catch (e) {
      delete subWorkerTopLevelAlphaBetaSetters[id];
      if (e) throw e;
    }
  }

  if (!wantsToDraw && value === 99999 + depth && !isCaptured(board, board.indexOf(6 + (board[64] << 3)), board[64])) {
    delete subWorkerTopLevelAlphaBetaSetters[id];
    return -99999;
  }

  delete subWorkerTopLevelAlphaBetaSetters[id];
  return value;
};

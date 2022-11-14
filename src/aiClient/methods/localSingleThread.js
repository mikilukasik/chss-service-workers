import { minimax as minimaxJs } from '../../../../chss-module-engine/src/engine_new/minimax/minimaxTopLevel.js';
import { move2moveString } from '../../../../chss-module-engine/src/engine_new/transformers/move2moveString.js';
import { getWasmEngine } from '../../../../chss-module-engine/src/engine_new/utils/wasmEngine.js';
import { getBoardPieceBalance } from '../../../../chss-module-engine/src/engine_new/utils/getBoardPieceBalance.js';
import { msgClient } from '../../../msg/src/client';
import { getUpdatedLmfLmt } from '../../../../chss-module-engine/src/engine_new/utils/getUpdatedLmfLmt.js';

const cutoff = 0.0001;
const modelName = 'pg_large';
const aiMultiplier = 2;

const deepMoveSorters = [
  { modelName: 'pg_small', cutoff: 0.00042 },
  { modelName: 'pg_tiny', cutoff: 0.00042 },
];

const predictionSocket = msgClient.ws(`ws://${self.location.hostname}:3300/predictionSocket`);

export const getMoveEvaluator = async ({ game }) => {
  const response = await predictionSocket.do('predictMove', { game, modelName });
  return (move) => response.moveValues[move];
};

export const localSingleThread = async ({ depth, game }) => {
  if (depth < 1) return;
  const { nextMoves, board, lmf, lmt } = game;

  const started = Date.now();
  const { getMovedBoard } = await getWasmEngine();
  const moveEvaluator = await getMoveEvaluator({ game });
  const moveAiValues = nextMoves.map(moveEvaluator);
  const wantsToDraw = board[64] ? getBoardPieceBalance(board) < 0 : getBoardPieceBalance(board) > 0;

  const sortedMoves = new Array(nextMoves.length)
    .fill(0)
    .map((e, i) => i)
    .filter((i) => moveAiValues[i] >= moveAiValues[0] * (cutoff || 0))
    .sort((a, b) => moveAiValues[b] - moveAiValues[a])
    .map((i) => nextMoves[i]);

  let winningMove;
  let pieceValue;

  if (board[64]) {
    let value = -999999;
    for (const move of sortedMoves) {
      const moveAiValue = moveEvaluator(move) * aiMultiplier; // / 3;
      const movedBoard = getMovedBoard(move, board);
      const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

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

      if (nmVal > value) {
        value = nmVal;
        pieceValue = nmVal - moveAiValue;
        winningMove = move;
      }
    }

    return {
      value,
      pieceValue,
      move: winningMove,
      moveStr: move2moveString(winningMove),
      ms: Date.now() - started,
    };
  }

  let value = 999999;
  for (const move of sortedMoves) {
    const moveAiValue = moveEvaluator(move) * -aiMultiplier; // / -3;
    const movedBoard = getMovedBoard(move, board);
    const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

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
    }
  }

  return {
    value,
    pieceValue,
    move: winningMove,
    moveStr: move2moveString(winningMove),
    ms: Date.now() - started,
  };
};

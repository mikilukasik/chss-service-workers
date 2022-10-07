import { getMoveEvaluator } from '../../../../chss-module-engine/src/engine_new/moveGenerators/getMoveEvaluator.js';
import { minimax } from '../../../../chss-module-engine/src/engine_new/minimax/minimax.js';
import { move2moveString } from '../../../../chss-module-engine/src/engine_new/transformers/move2moveString.js';
import { getMovedBoard } from '../../../../chss-module-engine/src/engine_new/utils/getMovedBoard.js';
// import { getWasmEngine } from '../../../../chss-module-engine/src/engine_new/utils/wasmEngine.js';

const localSingleThread = async ({ board, depth, moves }) => {
  if (depth < 1) return;

  // const { minimax, getMovedBoard } = await getWasmEngine();

  const started = Date.now();

  const moveEvaluator = await getMoveEvaluator(board);
  const moveAiValues = moves.map(moveEvaluator);

  const sortedMoves = new Array(moves.length)
    .fill(0)
    .map((e, i) => i)
    .sort((a, b) => moveAiValues[b] - moveAiValues[a])
    .map((i) => moves[i]);

  if (board[64]) {
    let value = -99999;
    let winningMove;

    for (const move of sortedMoves) {
      const moveAiValue = moveEvaluator(move) / 3;
      const movedBoard = getMovedBoard(move, board);
      // const [, nmVal] = minimax(movedBoard, depth - 1, value, 99999, moveAiValue);
      const nmVal = await minimax(movedBoard, depth - 1, value, 99999, moveAiValue);

      if (nmVal > value) {
        value = nmVal;
        winningMove = move;
      }
    }

    return {
      value,
      move: winningMove,
      moveStr: move2moveString(winningMove),
      ms: Date.now() - started,
    };
  }

  let value = 99999;
  let winningMove;

  for (const move of sortedMoves) {
    const moveAiValue = moveEvaluator(move) / -3;
    const movedBoard = getMovedBoard(move, board);
    // const [, nmVal] = minimax(movedBoard, depth - 1, -99999, value, moveAiValue);
    const nmVal = await minimax(movedBoard, depth - 1, -99999, value, moveAiValue);

    if (nmVal < value) {
      value = nmVal;
      winningMove = move;
    }
  }

  return {
    value,
    move: winningMove,
    moveStr: move2moveString(winningMove),
    ms: Date.now() - started,
  };
};

const methods = { localSingleThread };

export const ai = async ({ method, board, moves, depth = 4 }) => methods[method]({ board, depth, moves });

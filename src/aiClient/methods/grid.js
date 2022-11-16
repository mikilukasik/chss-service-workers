import { move2moveString } from '../../../../chss-module-engine/src/engine_new/transformers/move2moveString.js';
// import { getWasmEngine } from '../../../../chss-module-engine/src/engine_new/utils/wasmEngine.js';
import { getBoardPieceBalance } from '../../../../chss-module-engine/src/engine_new/utils/getBoardPieceBalance.js';
import { msgClient } from '../../../msg/src/client';
import { getUpdatedLmfLmt } from '../../../../chss-module-engine/src/engine_new/utils/getUpdatedLmfLmt.js';
import { doOnSubWorker } from './connectSubWorker.js';

const aiMultiplier = 2;
const deepMoveSorters = [
  { modelName: 'pg_large', cutoff: 0.0001 },
  { modelName: 'pg_small', cutoff: 0 /*, cutoff: 0.042*/ },
  { modelName: 'pg_tiny', cutoff: 0 /*, cutoff: 0.042*/ },
];

const engineSocket = msgClient.ws(`ws://${self.location.hostname}:3300/engineSocket`);

// export const getMoveEvaluator = async ({ game }) => {
//   const response = await engineSocket.do('predictMove', { game, modelName });
//   return (move) => response.moveValues[move];
// };

export const grid = async ({ depth, game }) => {
  if (depth < 1) return;
  // const { nextMoves, board, lmf, lmt } = game;
  // const started = Date.now();

  return engineSocket.do('predictOnGrid', { game, aiMultiplier, deepMoveSorters });

  // const { getMovedBoard } = await getWasmEngine();
  // const moveEvaluator = await getMoveEvaluator({ game });
  // const moveAiValues = nextMoves.map(moveEvaluator);
  // const wantsToDraw = board[64] ? getBoardPieceBalance(board) < 0 : getBoardPieceBalance(board) > 0;

  // const sortedMoves = new Array(nextMoves.length)
  //   .fill(0)
  //   .map((e, i) => i)
  //   .filter((i) => moveAiValues[i] >= moveAiValues[0] * (cutoff || 0))
  //   .sort((a, b) => moveAiValues[b] - moveAiValues[a])
  //   .map((i) => nextMoves[i]);

  // let winningMove;
  // let pieceValue;

  // if (board[64]) {
  //   let value = -999999;
  //   const minimaxParamsArr = [];

  //   await Promise.all(
  //     sortedMoves.map((move) => {
  //       const moveAiValue = moveEvaluator(move) * aiMultiplier; // / 3;
  //       const movedBoard = getMovedBoard(move, board);
  //       const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

  //       const params = {
  //         board: movedBoard,
  //         depth: depth - 1,
  //         alpha: value,
  //         beta: 999999,
  //         valueToAdd: moveAiValue,
  //         deepMoveSorters: deepMoveSorters,
  //         lmf: nextLm.lmf,
  //         lmt: nextLm.lmt,
  //         wantsToDraw: wantsToDraw,
  //         move,
  //       };
  //       minimaxParamsArr.push(params);

  //       return doOnSubWorker('minimax', params).then((nmVal) => {
  //         if (nmVal > value) {
  //           value = nmVal;
  //           minimaxParamsArr.forEach((p) => (p.alpha = nmVal));
  //           pieceValue = nmVal - moveAiValue;
  //           winningMove = move;
  //         }
  //       });
  //     }),
  //   );

  // return {
  //   value,
  //   pieceValue,
  //   move: winningMove,
  //   moveStr: move2moveString(winningMove),
  //   ms: Date.now() - started,
  // };
  // }

  // let value = 999999;

  // const minimaxParamsArr = [];

  // await Promise.all(
  //   sortedMoves.map((move) => {
  //     const moveAiValue = moveEvaluator(move) * -aiMultiplier; // / -3;
  //     const movedBoard = getMovedBoard(move, board);
  //     const nextLm = getUpdatedLmfLmt({ move, lmf, lmt });

  //     const params = {
  //       board: movedBoard,
  //       depth: depth - 1,
  //       alpha: -999999,
  //       beta: value,
  //       valueToAdd: moveAiValue,
  //       deepMoveSorters: deepMoveSorters,
  //       lmf: nextLm.lmf,
  //       lmt: nextLm.lmt,
  //       wantsToDraw: wantsToDraw,
  //       move,
  //     };
  //     minimaxParamsArr.push(params);

  //     return doOnSubWorker('minimax', params).then((nmVal) => {
  //       if (nmVal < value) {
  //         value = nmVal;
  //         minimaxParamsArr.forEach((p) => (p.beta = nmVal));
  //         pieceValue = nmVal - moveAiValue;
  //         winningMove = move;
  //       }
  //     });
  //   }),
  // );

  // return {
  //   value,
  //   pieceValue,
  //   move: winningMove,
  //   moveStr: move2moveString(winningMove),
  //   ms: Date.now() - started,
  // };
};

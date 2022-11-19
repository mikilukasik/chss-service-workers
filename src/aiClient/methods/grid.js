import { engineSocket } from '../engineSocket.js';

const aiMultiplier = 2;
const deepMoveSorters = [
  { modelName: 'pg_large', cutoff: 0.0001 },
  { modelName: 'pg_small', cutoff: 0, worker: 'main' /*, cutoff: 0.042*/ },
  { modelName: 'pg_tiny', cutoff: 0, worker: 'sub' /*, cutoff: 0.042*/ },
];

export const grid = async ({ depth, game }) => {
  if (depth < 1) return;

  return engineSocket.do('predictOnGrid', { game, aiMultiplier, deepMoveSorters, depth });
};

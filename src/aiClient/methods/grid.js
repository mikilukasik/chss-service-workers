import { engineSocket } from '../routes.js';

const aiMultiplier = 2;

const deepMoveSorters = [
  // { modelName: 'pg_large', cutoff: 0.0001 },
  { modelName: 'pg_ML', cutoff: 0.00005 },
  { modelName: 'pg_small', worker: 'main', cutoff: 0.0005 },
  { modelName: 'pg_tiny', worker: 'sub', cutoff: 0.0005 },
];

export const grid = async ({ depth, game }) => {
  if (depth < 1) return;

  return engineSocket.do('predictOnGrid', { game, aiMultiplier, deepMoveSorters, depth });
};

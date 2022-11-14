import { localSingleThread } from './localSingleThread.js';
import { localMultiThread } from './localMultiThread.js';
import { grid } from './grid.js';

const methods = { localSingleThread, localMultiThread, grid };

export const ai = async ({ method, game, depth = 4 }) => methods[method]({ game, depth });

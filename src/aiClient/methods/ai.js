import { localSingleThread } from './localSingleThread.js';
import { localMultiThread } from './localMultiThread.js';

const methods = { localSingleThread, localMultiThread };

export const ai = async ({ method, game, depth = 4 }) => methods[method]({ game, depth });

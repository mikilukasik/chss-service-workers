import { subWorkerTopLevelAlphaBetaSetters } from './minimax';

export const setAlpha = async (data, id) => {
  if (subWorkerTopLevelAlphaBetaSetters[id]) subWorkerTopLevelAlphaBetaSetters[id].setAlpha(data);
};

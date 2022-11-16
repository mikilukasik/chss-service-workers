import { subWorkerTopLevelAlphaBetaSetters } from './minimax';

export const setBeta = async (data, id) => {
  if (subWorkerTopLevelAlphaBetaSetters[id]) subWorkerTopLevelAlphaBetaSetters[id].setBeta(data);
};

import { subWorkerTopLevelAlphaBetaSetters } from './minimax';

export const setBeta = async (data, id) => {
  // console.log('sub_b');
  if (subWorkerTopLevelAlphaBetaSetters[id]) return subWorkerTopLevelAlphaBetaSetters[id].setBeta(data);
  // console.log(`setSubBeta could't find id`, id, subWorkerTopLevelAlphaBetaSetters);
};

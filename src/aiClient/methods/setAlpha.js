import { subWorkerTopLevelAlphaBetaSetters } from './minimax';

export const setAlpha = async (data, id) => {
  // console.log('sub_a');
  if (subWorkerTopLevelAlphaBetaSetters[id]) return subWorkerTopLevelAlphaBetaSetters[id].setAlpha(data);
  // console.log(`setSubAlpha could't find id`);
};

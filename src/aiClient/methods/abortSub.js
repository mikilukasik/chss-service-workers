import { subWorkerTopLevelAlphaBetaSetters } from './minimax';

export const abortSub = async (data, id) => {
  // console.log('sub_a');
  if (subWorkerTopLevelAlphaBetaSetters[id]) return subWorkerTopLevelAlphaBetaSetters[id].abort(data);
  // console.log(`setSubAlpha could't find id`);
};

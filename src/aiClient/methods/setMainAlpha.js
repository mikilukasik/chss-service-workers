import { mainWorkerTopLevelAlphaBetaSetters } from './minimaxMain';

export const setMainAlpha = async (data, id) => {
  // console.log('main_a', data);
  if (mainWorkerTopLevelAlphaBetaSetters[id]) return mainWorkerTopLevelAlphaBetaSetters[id].setAlpha(data);
  // console.log(`setMainAlpha could't find id`);
};

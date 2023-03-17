import { mainWorkerTopLevelAlphaBetaSetters } from './minimaxMain';

export const setMainBeta = async (data, id) => {
  // console.log('main_b', data);
  if (mainWorkerTopLevelAlphaBetaSetters[id]) return mainWorkerTopLevelAlphaBetaSetters[id].setBeta(data);
  // console.log(`setMainBeta could't find id`);
};

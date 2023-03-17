import { mainMethods } from '../methods/mainMethods.js';
import { setMainAlpha } from '../methods/setMainAlpha.js';
import { setMainBeta } from '../methods/setMainBeta.js';
import { msgClient } from '../../../msg/src/client';

export const mainWorkerSocket = msgClient.ws(`ws://${self.location.hostname}:3300/mainWorkerSocket`);

mainWorkerSocket.on('init', (data, comms) => {
  return comms.send('ok');
});

const setAlphaBetaHandlers = {
  setAlpha: setMainAlpha,
  setBeta: setMainBeta,
};
mainWorkerSocket.on('minimaxMain', async (data, comms) => {
  comms.onData(({ cmd, data }) => setAlphaBetaHandlers[cmd](data, comms.conversationId));

  // const updateGlobalAlpha = (value) => comms.data({ setAlpha: value });
  // const updateGlobalBeta = (value) => comms.data({ setBeta: value });

  const result = await mainMethods.minimaxMain(data, comms.conversationId /*{ updateGlobalAlpha, updateGlobalBeta }*/);
  return comms.send(result);
});

onmessage = async ({ data: rawData, ports }) => {
  const { cmd, data, id } = rawData;
  if (!mainMethods[cmd]) {
    console.log(`unknown cmd in mainWorker ${cmd}`);
    return;
  }

  try {
    const response = await mainMethods[cmd](data, id, ports);
    postMessage({ id, response });
  } catch (error) {
    postMessage({ id, error });
  }
};

import { engineSocket } from '../engineSocket.js';
import { minimax } from '../methods/minimax.js';
import { setAlpha } from '../methods/setAlpha.js';
import { setBeta } from '../methods/setBeta.js';
import { subMethods } from '../methods/subMethods.js';

onmessage = async ({ data: rawData, ports }) => {
  const { cmd, data, id } = rawData;
  if (!subMethods[cmd]) {
    console.log(`unknown cmd ${cmd}`);
    return;
  }

  try {
    const response = await subMethods[cmd](data, id, ports);
    postMessage({ id, response });
  } catch (error) {
    postMessage({ id, error });
  }
};

engineSocket.on('init', (data, comms) => {
  return comms.send('ok');
});

const setAlphaBetaHandlers = {
  setAlpha,
  setBeta,
};

engineSocket.on('minimax', async (data, comms) => {
  comms.onData(({ cmd, data, id }) => setAlphaBetaHandlers[cmd](data, id));
  const result = await minimax(data, comms.conversationId);
  return comms.send(result);
});

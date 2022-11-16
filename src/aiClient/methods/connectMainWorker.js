import { minimax } from './minimax';
import { setAlpha } from './setAlpha';
import { setBeta } from './setBeta';

export const mainWorkerPorts = [];

const cmdHandlers = {
  minimax,
  setAlpha,
  setBeta,
};

export const connectMainWorker = async (data, id, ports) => {
  ports.forEach((port) => {
    port.onmessage = ({ data: { cmd, data, id } }) => {
      cmdHandlers[cmd](data, id).then((response) => {
        if (response || typeof response !== 'undefined') port.postMessage({ cmd: 'response', id, data: response });
      });
    };
  });
  mainWorkerPorts.push(...ports);
};

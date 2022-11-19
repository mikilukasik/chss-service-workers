import { minimax } from './minimax';
import { setAlpha } from './setAlpha';
import { setBeta } from './setBeta';

export const mainWorkers = [];

export const connectMainWorker = async (data, id, ports) => {
  ports.forEach((port) => {
    const waitingResolvers = {};
    const worker = { port, waitingResolvers };

    const cmdHandlers = {
      response: (data, id) => {
        waitingResolvers[id]({ data, id });
        delete waitingResolvers[id];
      },
      minimax,
      setAlpha,
      setBeta,
    };

    port.onmessage = ({ data: { cmd, data, id } }) => {
      if (cmdHandlers[cmd].constructor.name === 'AsyncFunction')
        return cmdHandlers[cmd](data, id).then((response) => {
          if (response || typeof response !== 'undefined') port.postMessage({ cmd: 'response', id, data: response });
        });

      cmdHandlers[cmd](data, id);
    };

    mainWorkers.push(worker);
  });
};

export const doOnMainWorker = async (cmd, data, cb = () => {}) => {
  const id = Math.random();

  const worker = mainWorkers.find(Boolean);
  worker.port.postMessage({ cmd, data, id });

  return new Promise((r) => (worker.waitingResolvers[id] = r));
};

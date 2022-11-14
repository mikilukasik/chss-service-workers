import { minimax } from './minimax';

export const mainWorkerPorts = [];

const cmdHandlers = {
  minimax,
};

export const connectMainWorker = async (data, id, ports) => {
  console.log('connecting to mainWorker', { data, id, ports });
  ports.forEach((port) => {
    port.onmessage = ({ data: { cmd, data, id } }) => {
      cmdHandlers[cmd](data).then((response) => port.postMessage({ cmd: 'response', id, data: response }));
    };
  });
  mainWorkerPorts.push(...ports);
};

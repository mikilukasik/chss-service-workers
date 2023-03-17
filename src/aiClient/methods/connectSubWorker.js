import { getPrediction } from '../../../chss-module-engine/src/engine_new/tfModels/modelLoader.js';

export const subWorkers = [];
const subWorkerAwaiters = [];

const getNextAvailableSubWorker = () =>
  new Promise((res) => {
    const availableWorker = subWorkers.find((s) => !s.busy);
    if (availableWorker) {
      availableWorker.busy = true;
      return res(availableWorker);
    }

    subWorkerAwaiters.push(res);
  });

export const connectSubWorker = async (data, id, ports) => {
  subWorkers.push(
    ...ports.map((port) => {
      const waitingResolvers = {};
      const waitingErrorHandlers = {};
      const subWorker = { port, busy: false, waitingResolvers, waitingErrorHandlers };

      const onMessageHandlers = {
        response: ({ id, data }) => {
          waitingResolvers[id]({ data, id });
          delete waitingResolvers[id];

          const alreadyWaiting = subWorkerAwaiters.shift();
          if (alreadyWaiting) {
            alreadyWaiting(subWorker);
            return;
          }

          subWorker.busy = false;
        },
        error: ({ id, error }) => {
          waitingErrorHandlers[id](error);
          delete waitingErrorHandlers[id];

          const alreadyWaiting = subWorkerAwaiters.shift();
          if (alreadyWaiting) {
            alreadyWaiting(subWorker);
            return;
          }

          subWorker.busy = false;
        },
        predict: async ({ data }) => getPrediction(data),
      };

      port.onmessage = ({ data: { cmd, data, id } }) => {
        if (!onMessageHandlers[cmd]) throw new Error(`No handler for cmd ${cmd}`);

        if (onMessageHandlers[cmd].constructor.name === 'AsyncFunction') {
          return onMessageHandlers[cmd]({ id, data }).then((response) => {
            if (response || typeof response !== 'undefined') port.postMessage({ cmd: 'response', id, data: response });
          });
        }

        onMessageHandlers[cmd]({ id, data });
      };

      const alreadyWaiting = subWorkerAwaiters.shift();
      if (alreadyWaiting) {
        subWorker.busy = true;
        alreadyWaiting(subWorker);
        return subWorker;
      }

      return subWorker;
    }),
  );
};

export const doOnSubWorker = async (cmd, data, cb = () => {}) => {
  const worker = await getNextAvailableSubWorker();
  const id = Math.random();

  let aborted = false;
  const abort = () => (aborted = true);

  cb({ worker, id, abort });

  if (aborted) {
    const alreadyWaiting = subWorkerAwaiters.shift();
    if (alreadyWaiting) {
      alreadyWaiting(worker);
    } else {
      worker.busy = false;
    }

    return Promise.resolve();
  }

  worker.port.postMessage({ cmd, data, id });

  return new Promise((res, rej) => {
    worker.waitingResolvers[id] = res;
    worker.waitingErrorHandlers[id] = rej;
  });
};

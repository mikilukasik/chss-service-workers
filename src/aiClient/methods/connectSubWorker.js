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
      const subWorker = { port, busy: false, waitingResolvers };

      const onMessageHandlers = {
        response: ({ id, data }) => {
          waitingResolvers[id](data);
          delete waitingResolvers[id];

          const alreadyWaiting = subWorkerAwaiters.shift();
          if (alreadyWaiting) {
            alreadyWaiting(subWorker);
          }

          subWorker.busy = false;
        },
      };

      port.onmessage = ({ data: { cmd, data, id } }) => onMessageHandlers[cmd]({ id, data });

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

export const doOnSubWorker = async (cmd, data) => {
  const worker = await getNextAvailableSubWorker();
  const id = Math.random();

  worker.port.postMessage({ cmd, data, id });
  return new Promise((r) => (worker.waitingResolvers[id] = r));
};

import { getNextSpinnerChar } from './helpers/asciiSpinner.js';
import { createMainWorker, createSubWorker } from './aiClient/workers/createWorkers';

const subWorkerCount = Math.max(2, (navigator.hardwareConcurrency || 5) - 1);
console.log(`aiClient will create ${subWorkerCount} subWorkers.`);

// import { getWasmEngine } from '../chss-module-engine/src/engine_new/utils/wasmEngine.js';
// import { evaluateBoard } from '../chss-module-engine/src/engine_new/evaluators/evaluateBoard_new.js';

// getWasmEngine()
//   .then((we) => {
//     console.log('amottan', { we });
//     // @ts-expect-error we
//     window.top.we = we;
//     // @ts-expect-error we
//     window.top.evaluateBoard = evaluateBoard;
//   })
//   .catch((e) => {
//     console.error('itten', e);
//   });

setInterval(() => {
  const indicator = document.getElementById('indicator');
  indicator.innerHTML = getNextSpinnerChar(indicator.innerHTML || '|');
}, 50);

const workers: Record<string, Worker> = {
  mainWorker: createMainWorker(),
};

for (let subWorkerIndex = 0; subWorkerIndex < subWorkerCount; subWorkerIndex += 1) {
  const key = `subWorker${subWorkerIndex}`;
  workers[key] = createSubWorker();

  const channel = new MessageChannel();

  workers[key].postMessage({ cmd: 'connectMainWorker' }, [channel.port1]);
  workers.mainWorker.postMessage({ cmd: 'connectSubWorker' }, [channel.port2]);
}

Object.values(workers).forEach((worker) => {
  worker.onmessage = async ({ data: rawData }: { data: any }) => {
    try {
      const { error, response, id } = rawData;
      if (!responseAwaiters[id] || (!error && !response)) return;

      if (error) {
        responseAwaiters[id].reject(error);
        delete responseAwaiters[id];
        return;
      }

      responseAwaiters[id].resolve(response);
      delete responseAwaiters[id];
    } catch (e) {
      console.warn(e, { rawData });
    }
  };
});

const responseAwaiters: { [key: string]: { resolve: any; reject: any } } = {};

const toWorker = (topData: any, id: string) =>
  new Promise((resolve, reject) => {
    const { workerName, cmd, data } = topData as { cmd: string; data: any; workerName: 'mainWorker' | undefined };

    if (!workers[workerName]) throw new Error(`Could not find ${workerName} worker`);

    responseAwaiters[id] = { resolve, reject };
    workers[workerName].postMessage({ cmd, data, id });
  });

const methods = { toWorker };

window.addEventListener(
  'message',
  async ({ data: rawData }) => {
    const { cmd, data, id }: { data: any; id: any; cmd: 'toWorker' | undefined } = rawData;
    if (!methods[cmd]) return;

    try {
      const response = await methods[cmd](data, id);
      window.top.postMessage({ id, response }, '*');
    } catch (error) {
      window.top.postMessage({ id, error }, '*');
    }
  },
  false,
);

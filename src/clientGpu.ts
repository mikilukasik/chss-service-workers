import { createGpuWorker } from './client/workers/createGpuWorkers';

setInterval(() => {
  const indicator = document.getElementById('indicator');
  indicator.innerHTML = indicator.innerHTML ? '' : '.';
}, 1000);

const workerNum = 1; //(navigator || {}).hardwareConcurrency || 6;

console.log(`Will create ${workerNum} GPU workers.`);
new Array(workerNum).fill(0).forEach(() => createGpuWorker());

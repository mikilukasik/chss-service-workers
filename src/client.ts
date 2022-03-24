import { createCpuWorker } from './client/workers/createCpuWorkers';

setInterval(() => {
  const indicator = document.getElementById('indicator');
  indicator.innerHTML = indicator.innerHTML ? '' : '.';
}, 1000);

const workerNum = (navigator || {}).hardwareConcurrency || 6;

console.log(`Will create ${workerNum} CPU workers.`);
new Array(workerNum).fill(0).forEach(() => createCpuWorker());

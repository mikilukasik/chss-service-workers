import { createWorker } from './client/workers/createWorkers';

setInterval(() => {
  const indicator = document.getElementById('indicator');
  indicator.innerHTML = indicator.innerHTML ? '' : '.';
}, 1000);

const workerNum = (navigator || {}).hardwareConcurrency || 6;
console.log(`Will create ${workerNum} workers.`);

new Array(workerNum).fill(0).forEach(() => createWorker());

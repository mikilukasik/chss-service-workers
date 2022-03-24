import { getNextSpinnerChar } from './helpers/asciiSpinner.js';
import { createWorker } from './trainer/workers/createWorkers';

setInterval(() => {
  const indicator = document.getElementById('indicator');
  indicator.innerHTML = getNextSpinnerChar(indicator.innerHTML || '|');
}, 50);

const worker = createWorker();
worker.onmessage = () => document.location.reload();

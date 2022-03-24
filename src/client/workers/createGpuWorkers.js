import Worker from './playLearnerGameGpu.worker';
export const createGpuWorker = () => new Worker();

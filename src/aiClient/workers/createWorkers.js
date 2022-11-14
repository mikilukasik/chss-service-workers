import MainWorker from './aiClientMain.worker.js';
import SubWorker from './aiClientSub.worker.js';

export const createMainWorker = () => new MainWorker();
export const createSubWorker = () => new SubWorker();

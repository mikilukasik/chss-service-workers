console.log('Client controller loaded.');

import { msgClient as msg } from '../../msg/src/client';
import { reloadHandler } from './client/reloadHandler';

const socket = msg.ws(`ws://${self.location.hostname}:3300/learnersControllerSocket`);
socket.on(...reloadHandler);

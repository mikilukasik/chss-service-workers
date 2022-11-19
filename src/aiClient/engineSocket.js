import { msgClient } from '../../msg/src/client';

export const engineSocket = msgClient.ws(`ws://${self.location.hostname}:3300/engineSocket`);

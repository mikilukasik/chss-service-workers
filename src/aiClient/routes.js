import { msgClient } from '../../msg/src/client';
import { clientLogger } from '../../chss-module-logger';

export const engineSocket = msgClient.ws(`ws://${self.location.hostname}:3300/engineSocket`);

clientLogger({ msgClient });

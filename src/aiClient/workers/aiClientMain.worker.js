import { mainMethods } from '../methods/mainMethods.js';

onmessage = async ({ data: rawData, ports }) => {
  const { cmd, data, id } = rawData;
  if (!mainMethods[cmd]) {
    console.log(Object.keys(mainMethods));
    console.log(`unknown cmd ${cmd}`);
    return;
  }

  try {
    const response = await mainMethods[cmd](data, id, ports);
    postMessage({ id, response });
  } catch (error) {
    postMessage({ id, error });
  }
};

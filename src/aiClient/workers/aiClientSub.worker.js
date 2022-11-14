import { subMethods } from '../methods/subMethods.js';

onmessage = async ({ data: rawData, ports }) => {
  const { cmd, data, id } = rawData;
  if (!subMethods[cmd]) {
    console.log(`unknown cmd ${cmd}`);
    return;
  }

  try {
    const response = await subMethods[cmd](data, id, ports);
    postMessage({ id, response });
  } catch (error) {
    postMessage({ id, error });
  }
};

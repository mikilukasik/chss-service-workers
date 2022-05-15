import { methods } from '../methods';

onmessage = async ({ data: rawData }) => {
  const { cmd, data, id } = rawData;
  if (!methods[cmd]) return;

  try {
    const response = await methods[cmd](data, id);
    postMessage({ id, response });
  } catch (error) {
    postMessage({ id, error });
  }
};

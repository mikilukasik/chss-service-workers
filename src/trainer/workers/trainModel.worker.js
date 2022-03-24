import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-cpu';

import { msgClient as msg } from '../../../msg/src/client';

// tf.setBackend('cpu');
console.log(tf.getBackend());

const batchSize = 1000;
// const patience = 1;
const learningRate = 0.00000003; // TODO: this should be dynamic

export const trainModelHandler = [
  'trainModel',
  async (input, comms) => {
    const result = await trainModel(input);
    comms.send(result);
    setTimeout(() => {
      postMessage('reload');
    }, 8000);
  },
];

const trainerSocket = msg.ws(`ws://${self.location.hostname}:3300/trainerSocket`);
trainerSocket.on(...trainModelHandler);
trainerSocket.on('init', (data, comms) => comms.send({ success: true }));

self.window = self;

const models = {};
const modelsLoading = {};
const getModelResolvers = {};

const loadTransform = async (modelName) => {
  const transformAsString = await (
    await fetch(
      `http://${typeof window === 'undefined' || window.location.hostname}:3300/models/${modelName}/transform.js`,
    )
  ).text();

  const code = `(() => {${transformAsString.replace('module.exports =', 'return ')}})()`;
  return eval(code);
};

const loadConstants = async (modelName) => {
  return await (
    await fetch(
      `http://${typeof window === 'undefined' || window.location.hostname}:3300/models/${modelName}/constants.json`,
    )
  ).json();
};

const loadTfModel = async (modelName) => {
  console.log(`Loading model ${modelName}`);
  const model = await tf.loadLayersModel(
    `http://${typeof window === 'undefined' || window.location.hostname}:3300/models/${modelName}/model.json`,
  );
  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: 'meanSquaredError',
    metrics: [tf.metrics.meanAbsoluteError],
  });
  return model;
};

const loadModel = async (name) => {
  const [model, transform, constants] = await Promise.all([
    loadTfModel(name),
    loadTransform(name),
    loadConstants(name),
  ]).catch(console.error);
  models[name] = { model, transform, constants };
  console.log(`tf model ${name} loaded`);

  while (getModelResolvers[name].length) getModelResolvers[name].pop()(models[name]);
};

const getModel = (_name) => {
  const name = _name.replace(/-dot-/g, '.').replace(/-dollar-/g, '$');

  return new Promise((r) => {
    if (models[name]) return r(models[name]);
    getModelResolvers[name] = (getModelResolvers[name] || []).concat(r);

    if (!modelsLoading[name]) {
      modelsLoading[name] = true;
      loadModel(name);
    }
  });
};

const trainTfModel = async function ({ model, trainData }) {
  // console.log(`got a dataset with ${trainData.length} records`);

  let started;

  const options = {
    epochs: 1,
    verbose: 1,
    callbacks: [
      // tf.callbacks.earlyStopping({ monitor: 'meanAbsoluteError', patience }),

      new tf.CustomCallback({
        onEpochBegin: async () => {
          console.log(`Epoch begin...`);
          if (!started) started = Date.now();
        },
      }),

      new tf.CustomCallback({
        onEpochEnd: async (epoch, logs) => {
          console.log(`epoch took ${((Date.now() - started) / 1000).toFixed(2)} seconds`, logs);
        },
      }),
    ],
  };

  console.log(`Tensors in memory: ${tf.memory().numTensors}`);
  const result = await model.fitDataset(trainData, options);
  console.log(`Tensors in memory: ${tf.memory().numTensors}`);
  return result;
};

export const trainModel = async ({ modelName, lessonsParentId }) => {
  console.log({ modelName, lessonsParentId });

  const tensorsToDispose = [];

  const {
    model,
    transform,
    constants: { castlingIndex, enPassantIndex, inputLength, needsWNext },
  } = await getModel(modelName);

  const loadData = function (data) {
    const transform = ({ xs, ys }) => {
      xs = tf.tensor(xs, [8, 8, inputLength]);
      ys = tf.tensor1d(ys);

      tensorsToDispose.push(xs, ys);

      return {
        xs,
        ys,
      };
    };

    // load, normalize, transform, batch
    return tf.data.array(data).map(transform);
  };

  const rawLesson = await (
    await fetch(
      `http://${typeof window === 'undefined' || window.location.hostname}:3300/lessons/byparentid/${lessonsParentId}`,
    )
  ).json();

  console.log(`got a dataset with ${rawLesson.length} records`);

  const lesson = rawLesson.map(({ xsParams, ys }) => ({ xs: transform.fen2flatArray(xsParams), ys }));
  const trainData = loadData(lesson);

  await trainTfModel({
    model,
    trainData: trainData.batch(batchSize),
  });

  await model.save(`http://${self.location.hostname}:3300/uploadModel/${modelName}`);

  model.dispose();
  delete models[modelName];
  while (tensorsToDispose.length) tensorsToDispose.pop().dispose();
  tf.disposeVariables();
  console.log(`Tensors in memory: ${tf.memory().numTensors}`);
};

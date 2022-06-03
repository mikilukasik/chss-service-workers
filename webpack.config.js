const path = require('path');

module.exports = [
  {
    entry: './src/clientController.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/, /assembly/],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'clientControllerBundle.js',
      path: path.resolve(__dirname, 'public'),
    },
    experiments: {
      topLevelAwait: true,
    },
  },
  {
    entry: './src/client.ts',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: [/node_modules/, /assembly/],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/, /assembly/],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'public'),
    },
    experiments: {
      topLevelAwait: true,
    },
  },
  {
    entry: './src/clientGpu.ts',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: [/node_modules/, /assembly/],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/, /assembly/],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'bundleGpu.js',
      path: path.resolve(__dirname, 'public'),
    },
    experiments: {
      topLevelAwait: true,
    },
  },
  {
    entry: './src/trainer.ts',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: [/node_modules/, /assembly/],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/, /assembly/],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'trainer.js',
      path: path.resolve(__dirname, 'public'),
    },
    experiments: {
      topLevelAwait: true,
    },
  },
  {
    entry: './src/aiClient.ts',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
          exclude: [/node_modules/, /assembly/],
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: [/node_modules/, /assembly/],
        },
        {
          test: /\.wasm$/,
          // Tells webpack how to interpret wasm files into JavaScript-land
          type: 'javascript/auto',
          loader: 'wasm-loader',
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'aiClient.js',
      path: path.resolve(__dirname, 'public'),
    },
    experiments: {
      topLevelAwait: true,
      asyncWebAssembly: true,
      syncWebAssembly: true,
    },
  },
];

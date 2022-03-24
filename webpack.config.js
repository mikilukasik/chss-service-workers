const path = require('path');

module.exports = [
  {
    entry: './src/clientController.ts',
    module: {
      rules: [
        // {
        //   test: /\.worker\.js$/,
        //   use: { loader: 'worker-loader' },
        // },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
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
  },
  {
    entry: './src/client.ts',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
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
  },
  {
    entry: './src/clientGpu.ts',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
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
  },
  {
    entry: './src/trainer.ts',
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
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
  },
];

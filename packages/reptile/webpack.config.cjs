const path = require('path');
const nodeExternals = require('webpack-node-externals');
const RunNodeWebpackPlugin = require('run-node-webpack-plugin');

module.exports = {
  cache: true,
  mode: 'production',
  entry: {
    index: './src/index.ts',
  },
  target: 'node',
  devtool: 'source-map',
  // in order to ignore built-in modules like path, fs, etc.
  externalsPresets: { node: true },
  // in order to ignore all modules in node_modules folder
  externals: [
    nodeExternals({
      allowlist: [/lodash/, /lowdb/, /@new-house/],
    }),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].cjs',
    clean: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              target: 'es2022',
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['raw-loader'],
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new RunNodeWebpackPlugin({
      nodeArgs: {
        execArgv: ['--enable-source-maps'],
      },
      // runOnlyInWatchMode: true,
      scriptToRun: 'index.cjs',
    }),
  ],
};

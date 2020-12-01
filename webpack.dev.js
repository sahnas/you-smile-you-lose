const { merge } = require('webpack-merge');
const express = require('express');
const serveIndex = require('serve-index');
// eslint-disable-next-line import/no-extraneous-dependencies
const webpack = require('webpack');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  target: 'web',
  devServer: {
    before(app) {
      app.use(
        '/models',
        express.static(`${__dirname}src/models`),
        serveIndex(`${__dirname}/src/models`, { icons: true }),
      );
    },
    hot: true,
    contentBase: './src',
    watchContentBase: true,
  },
  watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000, // seems to stablise HMR file change detection
    ignored: /node_modules/,
  },
});

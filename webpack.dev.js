const { merge } = require('webpack-merge');
const express = require('express');
const serveIndex = require('serve-index');
const common = require('./webpack.config.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  optimization: {
    minimize: false,
  },
  devServer: {
    before(app) {
      app.use(
        '/models',
        express.static(`${__dirname}src/models`),
        serveIndex(`${__dirname}/src/models`, { icons: true }),
      );
    },
  },
});

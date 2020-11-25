const { merge } = require("webpack-merge");
const common = require("./webpack.config.js");
const express = require("express");
const serveIndex = require("serve-index");

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  optimization: {
    minimize: false,
  },
  devServer: {
    before: function (app, server, compiler) {
      app.use(
        "/models",
        express.static(__dirname + "src/models"),
        serveIndex(__dirname + "/src/models", { icons: true })
      );
    },
  },
});

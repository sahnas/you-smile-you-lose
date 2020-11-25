/* eslint-disable */
// const express = require("express")
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const serveIndex = require("serve-index");

module.exports = {
  entry: "./src/js/entry.js",
  output: {
    filename: "entry.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: false,
  externals: {
    'node-fetch': 'fetch'
  },
  // externals: {
  //   "./ext/ext.js": "globalHello",
  // },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      template: "src/index.html",
      filename: "index.html",
      favicon: "src/img/favicon.ico",
    }),
    new CopyWebpackPlugin([
      {
        from: "src/models",
        to: "./models",
      },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: "img",
            },
          },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
          },
        ],
      },
      {
        test: /\.(jpg|png|ico)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name: "[name].[ext]",
              outputPath: "img",
              publicPath: "img",
            },
          },
        ],
      },
      { test: /\.json$/, loader: "json-loader" },
    ],
  },
  devServer: {
    inline: true,
    contentBase: path.resolve(__dirname, "dist"),
    port: 5000,
    // before: function (app, server, compiler) {
    //   app.use(
    //     "/models",
    //     express.static(__dirname + "src/models"),
    //     serveIndex(__dirname + "/src/models", { icons: true })
    //   );
    // },
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    console: true,
  },
  target: "node",
};
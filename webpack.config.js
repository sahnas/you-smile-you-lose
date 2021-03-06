/* eslint-disable */
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const zlib = require("zlib");
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: "./src/js/entry.js",
  output: {
    filename: "entry.js",
    path: path.resolve(__dirname, "dist"),
  },
  devtool: false,
  externals: {
    "node-fetch": "fetch",
  },
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
      minify: {
        collapseWhitespace: true,
      },
    }),
    new CopyWebpackPlugin([
      {
        from: "src/models",
        to: "./models",
      },
      {
        from: "src/img",
        to: "./img",
        ToType: "file",
        ignore: ["favicon.ico", "background.png"],
      },
    ]),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new CompressionPlugin({
      filename: "[path][base].br",
      algorithm: "brotliCompress",
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        params: {
          [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
        },
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
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
              presets: [["@babel/preset-env", { modules: false }]],
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
  },
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
    console: true,
  },
  target: "node",
};

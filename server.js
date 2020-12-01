/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const express = require('express');
const expressStaticGzip = require('express-static-gzip');
const compiler = require('webpack')(require('./webpack.config.js'));

const app = express();

app.use(require('webpack-dev-middleware')(compiler));
app.use(require('webpack-hot-middleware')(compiler));
app.use(require('webpack-hot-server-middleware')(compiler));

app.use(
  '/',
  expressStaticGzip(
    path.join(
      __dirname,
      {
        enableBrotli: true,
      },
      'dist',
    ),
  ),
);
app.set('port', process.env.PORT || 8080);

// eslint-disable-next-line no-unused-vars
const server = app.listen(app.get('port'), () => {});

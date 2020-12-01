const path = require('path');
const express = require('express');
const compiler = require('webpack')(require('./webpack.config.js'));

app.use(require('webpack-dev-middleware')(compiler));
app.use(require('webpack-hot-middleware')(compiler));
app.use(require('webpack-hot-server-middleware')(compiler));

const app = express();

app.use('/', express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8080);

// eslint-disable-next-line no-unused-vars
const server = app.listen(app.get('port'), () => {});

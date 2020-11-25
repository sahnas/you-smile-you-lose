const path = require('path');
const express = require('express');

const app = express();

app.use('/', express.static(path.join(__dirname, 'dist')));
app.set('port', process.env.PORT || 8080);


// eslint-disable-next-line no-unused-vars
const server = app.listen(app.get('port'), () => {});

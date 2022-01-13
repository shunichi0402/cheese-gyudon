const express = require('express');
const consola = require('./library/consola');
const app = express();

app.use('/', express.static( __dirname + '/pages'));

app.use((req, res, next) => {
    res.status(404);
    res.sendFile(__dirname + '/pages/notfound/index.html');
});

app.listen(4000, () => {
    consola.log('Example app listening on port 3000!', consola.color.green);
});
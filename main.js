const express = require('express');

const app = express();

app.use(express.static(__dirname + '/dist/personal-site'));

app.get('/*', (req, res, next) =>
{
    res.sendFile(__dirname + '/dist/personal-site/index.html');
});
app.listen(process.env.PORT || 8080);
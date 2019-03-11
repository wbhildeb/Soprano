const express = require('express');

const app = express();

app.use(express.static(__dirname + '/dist/personal-site'));

app.get('/test', (req, res, next) =>
{
    res.end('test complete');
});

app.listen(process.env.PORT || 8080);
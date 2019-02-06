const express = require('express');

const app = express();

app.use((req, res, next) => {
    console.log('First middleware executed...');
    next();
});

app.use((req, res, next) => {
    console.log('Second middleware executed...');
    res.send('End');
});

module.exports = app;
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
const foosboard = require('foosboard');
const soprano = require('./backend/soprano/app');

const app = express();

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(session({
    secret: 'gotta go home',
    store: new FileStore({}),
    resave: false,
    saveUninitialized: true,
  }))
  .use(
    (req, res, next) =>
    {
      // res.setHeader('Access-Control-Allow-Origin', `http://localhost/`);
      // res.setHeader('Access-Control-Allow-Origin', `${req.baseUrl}:${PORT}`);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Request-With, Content-Type, Accept'
        );
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET, POST, PATCH, DELETE, OPTIONS'
          );
          next();
    })

  .use('/api/foosboard', foosboard)
  .use('/api/soprano', soprano)
  .use('*', (err, req, res, next) =>
  {
    console.error(req.method, req.baseUrl);
    console.error('query ', req.query);
    console.error('session ', req.sessionID);
    console.error('body ', req.body);
    console.error('-----------------------------------------------');
    console.error(err);
    console.error('-----------------------------------------------');
    
    res.status(500);
    res.redirect('/error');
  });


app.use(express.static(__dirname + '/dist/Site'));

app.get('/*', function(req, res)
{
  res.sendFile(path.join(__dirname + '/dist/Site/index.html'));
});

app.listen(process.env.PORT || 80);

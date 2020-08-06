const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const soprano = require('./backend/soprano/app');

const app = express();

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.json())
  .use(session({
    secret: 'gotta go home',
    store: new FileStore({}),
    resave: false,
    saveUninitialized: true,
    retries: 0,
  }))
  .use(
    (req, res, next) =>
    {
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
  .use('/api/soprano', soprano.router)
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

soprano.ready.then(() =>
{
  app.listen(3000);
});


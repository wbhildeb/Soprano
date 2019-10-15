/**
 * app.js
 *
 * Walker Hildebrand
 * 2019-10-07
 *
 */

// /////// Imports /////////////////////////////////////////
const express = require('express');
const session = require('express-session');
const database = require('./database');
const spotifyWrapper = require('./spotify');

const app = express();
const db = database();
const spotify = spotifyWrapper();

app
  .use(session({
    secret: 'gotta go home',
    resave: false,
    saveUninitialized: true,
  }))
  .use(
    (req, res, next) =>
    {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
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
    });

// Debugging
app.get('*', (req, res, next) => 
{
  console.log(`request type:  ${req.method}`);
  console.log(`url:           ${req.url}`);
  console.log(`session:       ${req.sessionID}`);
  console.log('-----------------------------------------------');
  next();
});

app.get('/spotify/login', (req, res) => 
{
  const authURL = spotify.GetAuthorizationURL(req.sessionID);
  res.redirect(authURL);
});

app.get('/spotify/callback', (req, res) => 
{
  const state = req.query.state;
  const code = req.query.code;

  if (state != req.sessionID)
  {
    console.error(`Mismatched state error - session: ${req.sessionID}, state: ${state}`);
    res.redirect('/error');
  }
  else
  {
    var authToken;
    var refreshToken;
    var userID;
    spotify.GetAuthCredentials(code)
      .then(
        creds =>
        {
          authToken = creds.authToken;
          refreshToken = creds.refreshToken;

          spotify.SetAuthCredentials(creds);
          return spotify.GetUserID();
        })
      .then(
        id =>
        {
          userID = id;
          return db.SaveSession(req.sessionID, id);
        })
      .then(
        () =>
        {
          db.UpdateAuthenticationInfo(userID, authToken, refreshToken);
        });
    
    res.redirect('http://localhost:4200/sub-playlists/');
  }
});

app.get('/spotify/userID', (req, res) =>
{
  db
    .GetUserID(req.sessionID)
    .then(
      id => res.status(200).json(id),
      err => res.status(201).json(err)
    );
});

app.get('/spotify/playlists', (req, res) =>
{
  db
    .GetUserID(req.sessionID)
    .then(
      id => db.GetUser(id),
      err => { res.status(201).json(err); })
    .then(
      user =>
      {
        spotify.SetAuthCredentials({ authToken: user.authToken, refreshToken: user.refreshToken});
        spotify.GetPlaylists();
      },
      err => res.status(201).json(err)
    );
});

app.listen(3000);

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
const querystring = require('querystring');

const SPOTIFY_INFO = {
  AuthorizeLink: 'https://accounts.spotify.com/authorize?',
  ClientID: '391e2916ad4a4709908a2d71ffaeb0c5',
  Scope: 'user-library-modify user-read-private user-modify-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-private',
  RedirectURI: 'http://localhost:3000/spotify/callback',
};

const app = express();

app
  .use(session({
    secret: 'gotta go home',
    resave: false,
    saveUninitialized: true,
  }));

// Debugging
app.get('*', (req, res, next) => {
  console.log(`request type:  ${req.method}`);
  console.log(`url:           ${req.url}`);
  console.log(`session:       ${req.sessionID}`);
  console.log('-----------------------------------------------');
  next();
});

app.get('/spotify/login', (req, res, next) => {
  const query = querystring.stringify({
    response_type: 'code',
    client_id: SPOTIFY_INFO.ClientID,
    scope: SPOTIFY_INFO.Scope,
    redirect_uri: SPOTIFY_INFO.RedirectURI,
    state: req.sessionID,
  });

  res.redirect(SPOTIFY_INFO.AuthorizeLink + query);
});

app.get('/spotify/callback', (req, res, next) => {
  const state = req.query.state;
  const code = req.query.code;

  if (req.query.state != req.sessionID) {
    console.error(`Mismatched state error - session: ${req.sessionID}, state: ${state}`);
    res.redirect('/error');
  }

  console.log(code);
  res.send();
});

app.listen(3000);

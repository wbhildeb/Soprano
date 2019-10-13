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
  }));

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
    var authOptions =
    {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: spotify.redirectURI,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + Buffer.from(spotify.clientID + ':' + spotify.clientSecret).toString('base64')
      },
      json: true
    };

    req.post(authOptions, function(err, res, body)
    {
      if (!err && res.statusCode === 200)
      {
        // const session = new Session({
        //   sessionID: req.sessionID,
        //   authToken: body.access_token,
        //   refreshToken: body.refresh_token
        // });
    
        // addOrUpdateSession(session);
      }
      else
      {
        console.log(`POST request error - status code ${res.statusCode}`);
        console.log(err);
      }
    });

    res.redirect('http://localhost:4200/sub-playlists/');
  }
});

app.get('spotify/playlists', (req, res, next) =>
{
  const state = req.sessionID;
  const id = db.GetUserID(state);
});

app.listen(3000);

/**
 * app.js
 *
 * Walker Hildebrand
 * 2019-10-20
 *
 */

// /////// Imports /////////////////////////////////////////
const express = require('express');
const session = require('express-session');
const database = require('./database');
const spotifyWrapper = require('./spotify');
const helper = require('./helper');

const app = express();
const db = database();
const spotify = spotifyWrapper();

// Refresh since none of the cookies are going to be the same
db.DeleteSessionData();

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
    var credentials;
    var userID;
    spotify.GetAuthCredentials(code)
      .then(
        creds =>
        {
          credentials = creds;

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
          db.UpdateAuthCredentials(userID, credentials);
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
      err => res.status(201).json(err))
    .then(
      user =>
      {
        spotify.SetAuthCredentials({ authToken: user.authToken, refreshToken: user.refreshToken});
        return spotify.GetPlaylists();
      },
      err => res.status(201).json(err))
    .then(
      playlists =>
      {
        console.log(playlists);
        res.status(200).json(playlists);
      },
      err => res.status(201).json(err)
    );
});

app.listen(3000);

/**
 * Updates all the authentication credentials for each user in the database
 *   If unable to authenticate, sets the authToken and refreshToken to null
 */
function UpdateAllAuthCredentials()
{
  console.log('update');
  db
    .GetUsers()
    .then(users =>
    {
      users.forEach(
        user =>
        {
          if (!user.exists())
          {
            console.error('User does not exist');
            return;
          }

          const data = user.val();
          if (!data.credentials) return;

          spotify
            .RefreshAuthCredentials(data.credentials)
            .then(
              credentials =>
              {
                console.log(
                  'Updated authToken:',
                  data.credentials.authToken,
                  '->',
                  credentials.authToken
                );
                
                user.getRef().child('credentials').update(credentials);
              },
              err =>
              {
                console.error(err);

                user.getRef().child('credentials').update({
                  authToken: null,
                  refreshToken: null
                });
              }
            );
        });
    });
}

setInterval(
  UpdateAllAuthCredentials,
  helper.ToMilliseconds({ minutes: 20 })
);
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
const FileStore = require('session-file-store')(session);
const path = require('path');
const foosboard = require('foosboard');
const database = require('./backend/database');
const spotifyWrapper = require('./backend/spotify');
const helper = require('./backend/helper');

const app = express();
const db = database();
const spotify = spotifyWrapper();

// Refresh since none of the cookies are going to be the same
//db.DeleteSessionData(); TODO: Uncomment at some point

app
  .use(session({
    secret: 'gotta go home',
    store: new FileStore({}),
    resave: false,
    saveUninitialized: true,
  }))
  .use('/api/foosboard', foosboard)
  .use(
    (req, res, next) =>
    {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
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
app.use('*', (req, res, next) => 
{
  console.log(`request type:  ${req.method}`);
  console.log(`url:           ${req.url}`);
  console.log(`session:       ${req.sessionID}`);
  console.log('query:', query);
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
          return spotify.GetUser();
        })
      .then(
        user =>
        {
          userID = user.id;
          return db.SaveSession(req.sessionID, user.id);
        })
      .then(
        () =>
        {
          db.UpdateAuthCredentials(userID, credentials);
        });
    
    res.redirect('http://localhost:3000/sub-playlists/');
  }
});

app.get('/spotify/userID', (req, res) =>
{
  db
    .GetUserID(req.sessionID)
    .then(
      id => res.status(200).json(id),
      err => res.status(500).json(err)
    );
});

app.get('/spotify/userDetails', (req, res) =>
{
  db
    .GetUserID(req.sessionID)
    .then(userID => db.GetUser(userID))
    .then(user =>
    {
      spotify.SetAuthCredentials(user.credentials);
      return spotify.GetUser();
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

app.get('/spotify/playlists', (req, res) =>
{
  db
    .GetUserID(req.sessionID)
    .then(
      id => db.GetUser(id))
    .then(
      user =>
      {
        spotify.SetAuthCredentials(user.credentials);
        return spotify.GetPlaylists();
      })
    .then(
      playlists =>
      {
        console.log(playlists);
        res.status(200).json(playlists);
      })
    .catch(err => res.status(500).json(err));
});

app.use(express.static(__dirname + '/dist/Site'));

app.get('/*', function(req, res)
{  
  res.sendFile(path.join(__dirname+'/dist/Site/index.html'));
});

app.listen(process.env.PORT || 80);

db.GetParentPlaylists();

/**
 * 
 */
function UpdateSubPlaylists()
{
  db.GetParentPlaylists()
    .then(
      playlistobj =>
      {
        Object.keys(playlistobj).forEach(
          userID =>
          {
            db.GetUser(userID)
              .then(
                user =>
                {
                  spotify.SetAuthCredentials(user.credentials);
                  helper
                    .PostOrder(helper.Treeify(playlistobj[userID].playlists))
                    .forEach(
                      pair =>
                      {
                        spotify.AddPlaylistToPlaylist(pair.child, pair.parent);
                      });
                });
            
          });
      },
      console.log
    )
    .catch(console.log);
}

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

setInterval(
  UpdateSubPlaylists,
  helper.ToMilliseconds({ hours: 1 })
);
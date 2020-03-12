const express = require('express');

const helper = require('./helper');
const db = require('./database')();
const spotify = require('./spotify')();

const router = express.Router();

// Refresh since none of the cookies are going to be the same
db.DeleteSessionData();

router.get('/auth/login', (req, res) =>
{
  const authURL = spotify.GetAuthorizationURL(req.sessionID);
  db.SignIn();
  res.redirect(authURL);
});

router.get('/auth/callback', (req, res) =>
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

    res.redirect('/sub-playlists');
  }
});

router.get('/user/id', (req, res) =>
{
  console.log('/user/id');
  db
    .GetUserID(req.sessionID)
    .then(
      id => res.status(200).json(id),
      err => res.status(500).json(err)
    );
});

router.get('/user/details', (req, res) =>
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

router.get('/playlists', (req, res) =>
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
        res.status(200).json(playlists);
      })
    .catch(err => res.status(500).json(err));
});

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

module.exports = router;

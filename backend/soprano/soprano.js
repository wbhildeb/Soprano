const express = require('express');

const helper = require('./helper');
const db = require('./database')();
const spotify = require('./spotify')();

const router = express.Router();

// Refresh since none of the cookies are going to be the same
db.session.DeleteSessionData();

router.get('/auth/login', (req, res) =>
{
  const authURL = spotify.GetAuthorizationURL(req.sessionID);
  res.redirect(authURL);
});

router.get('/auth/logout', (req, res) =>
{
  db.session.DeleteSession(req.sessionID);
  res.redirect('/');
});

router.get('/auth/notme', (req, res) =>
{
  db.session.DeleteSession(req.sessionID);
  const authURL = spotify.GetAuthorizationURL(req.sessionID, true);
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
          return db.session.SaveSession(req.sessionID, user.id);
        })
      .then(
        () =>
        {
          db.user.UpdateAuthCredentials(userID, credentials);
        });

    res.redirect('/sub-playlists');
  }
});

router.get('/user/id', (req, res) =>
{
  db
    .session
    .GetUserID(req.sessionID)
    .then(
      id => res.status(200).json(id),
      err => res.status(500).json(err)
    );
});

router.get('/user/details', (req, res) =>
{
  db
    .session
    .GetUserID(req.sessionID)
    .then(userID => db.user.GetUserCredentials(userID))
    .then(creds =>
    {
      spotify.SetAuthCredentials(creds);
      return spotify.GetUser();
    })
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json(err));
});

router.get('/playlists', (req, res) =>
{
  db
    .session
    .GetUserID(req.sessionID)
    .then(
      id => db.user.GetUserCredentials(id))
    .then(
      creds =>
      {
        spotify.SetAuthCredentials(creds);
        return spotify.GetPlaylists();
      })
    .then(
      playlists =>
      {
        res.status(200).json(playlists);
      })
    .catch(err => res.status(500).json(err));
});

db.user.GetParentPlaylists();

/**
 *
 */
function UpdateSubPlaylists()
{
  db.user.GetParentPlaylists()
    .then(
      playlistobj =>
      {
        Object.keys(playlistobj).forEach(
          userID =>
          {
            db.user.GetUserCredentials(userID)
              .then(
                creds =>
                {
                  spotify.SetAuthCredentials(creds);
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
    .user
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

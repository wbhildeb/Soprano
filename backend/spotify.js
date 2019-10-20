/**
 * spotify.js
 * 
 * Walker Hildebrand
 * 2019-10-20
 *
 */

const SpotifyWebAPI = require('spotify-web-api-node');

const spotifyAPI = new SpotifyWebAPI({
  clientId: '391e2916ad4a4709908a2d71ffaeb0c5',
  clientSecret: '8bfdab0cdbd841bfb127f58545b90402',
  redirectUri: 'http://localhost:3000/spotify/callback'
});

const scopes = [
  'user-library-modify',
  'user-read-private',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-modify-playback-state',
  'user-read-private'
];

// Helper functions
const PLAYLIST_FETCH_LIMIT = 50;

const _getAllUserPlaylists = function(offset)
{
  if (!offset) offset = 0;
  return new Promise((resolve, reject) =>
  {
    spotifyAPI
      .getUserPlaylists({limit: PLAYLIST_FETCH_LIMIT, offset})
      .then(
        data =>
        {
          const playlists = data.body.items.map(playlist => ({
            id: playlist.id,
            name: playlist.name
          }));

          if (data.body.offset + data.body.limit >= data.body.total)
          {
            // Got the last of the playlists
            resolve(playlists);
          }
          else
          {
            _getAllUserPlaylists(offset+data.body.limit).then(
              data => resolve(playlists.concat(data)),
              err => reject(err)
            );
          }
        });
  });
};


class SpotifyWrapper
{
  /**
   * @typedef {Object} AuthCredentials
   * @property {string} authToken - The token used for authentication
   * @property {string} refreshToken - The token used for refreshing credentials
   */

  /**
   * @param {string} sessionID The sessionID of the user
   * @param {boolean} [showDialog] = false by default 
   * 
   * @returns {string} The URL to get authorization
   */
  GetAuthorizationURL(sessionID, showDialog)
  {
    if (showDialog === undefined) showDialog = false;
    return spotifyAPI.createAuthorizeURL(scopes, sessionID, showDialog);
  }

  /**
   * Get the authentication code and refresh token
   * @param {string} code The code returned by a request to the authorization URL
   * @returns {AuthCredentials}
   */
  GetAuthCredentials(code)
  {
    return new Promise(
      (resolve, reject) =>
      {
        spotifyAPI.authorizationCodeGrant(code).then(
          data => 
          {
            const authToken = data.body['access_token'];
            const refreshToken = data.body['refresh_token'];
            console.log(data.body);
    
            resolve({ authToken, refreshToken });
          },
          err => 
          {
            reject('Failed to get authentication credentials', err);
          });
      }
    );
  }

  /**
   * Set the authentication token and refresh token for future calls
   * @param {AuthCredentials} credentials 
   */
  SetAuthCredentials(credentials)
  {
    spotifyAPI.setAccessToken(credentials.authToken);
    spotifyAPI.setRefreshToken(credentials.refreshToken);
  }

  /**
   * Refresh the given credentials (does not update the wrapper's credentials to given values)
   * @param {AuthCredentials} credentials 
   * @returns {Promise<AuthCredentials>} null if unable to refresh
   */
  RefreshAuthCredentials(credentials)
  {
    const oldCredentials = {
      authToken: spotifyAPI.getAccessToken(),
      refreshToken: spotifyAPI.getRefreshToken()
    };
    
    this.SetAuthCredentials(credentials);
    return spotifyAPI.refreshAccessToken().then(
      data =>
      {
        // Reset credentials
        this.SetAuthCredentials(oldCredentials);

        return {
          authToken: data.body['access_token'],
          refreshToken: credentials.refreshToken
        };
      }
    );
  }

  /**
   * @returns {Promise}
   */
  GetUserID() 
  {
    return new Promise(
      (resolve, reject) =>
      {
        spotifyAPI
          .getMe()
          .then(
            data => resolve(data.body.id),
            err => reject('Unable to retrieve user: ' + err)
          );
      });
  }

  /**
   * @returns {Promise<Object[]>}
   */
  GetPlaylists()
  {
    return _getAllUserPlaylists();
  }
}

module.exports = () => new SpotifyWrapper();

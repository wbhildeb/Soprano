
const env = require('./environment');
const SpotifyAPI = require('spotify-web-api-node');

const spotifyAPI = new SpotifyAPI(env.spotify.clientInfo);

// Helper functions
const PLAYLIST_FETCH_LIMIT = 50;
const TRACK_FETCH_LIMIT = 50;
const ADD_TRACK_LIMIT = 100;

const _getAllPlaylistTrackIDs = function(playlistID, offset)
{
  if (!offset) offset = 0;
  return new Promise((resolve, reject) =>
  {
    spotifyAPI
      .getPlaylistTracks(playlistID, {fields: 'items.track.id,limit,total,offset', offset, limit: TRACK_FETCH_LIMIT})
      .then(
        data =>
        {
          const trackIDs = data.body.items.map(item => item.track.id);

          if (data.body.offset + data.body.limit >= data.body.total)
          {
            // Got the last of the trackIDs
            resolve(trackIDs);
          }
          else
          {
            _getAllPlaylistTrackIDs(playlistID, offset + data.body.limit)
              .then(data => resolve(trackIDs.concat(data)))
              .catch(reject);
          }
        })
      .catch(console.error);
  });
};

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
          const playlists = data.body.items;

          if (data.body.offset + data.body.limit >= data.body.total)
          {
            // Got the last of the playlists
            resolve(playlists);
          }
          else
          {
            _getAllUserPlaylists(offset + data.body.limit)
              .then(data => resolve(playlists.concat(data)))
              .catch(reject);
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
   * @param {boolean} [showDialog=false]
   * @returns {string} The URL to get authorization
   */
  GetAuthorizationURL(sessionID, showDialog)
  {
    if (showDialog === undefined) showDialog = false;
    return spotifyAPI.createAuthorizeURL(env.spotify.scopes, sessionID, showDialog);
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
   * Return user details
   * @returns {Promise}
   */
  GetUser()
  {
    return new Promise(
      (resolve, reject) =>
      {
        spotifyAPI
          .getMe()
          .then(data => resolve(data.body))
          .catch(err => reject('Unable to retrieve user: ' + err));
      });
  }

  /**
   * @returns {Promise<Object[]>}
   */
  GetPlaylists()
  {
    return _getAllUserPlaylists();
  }

  /**
   * Add the given tracks to the given playlist
   * @param {string} playlistID
   * @param {string[]} tracks
   * @returns {Promise} a promise that resolves when the tracks have been added
   */
  AddTracksToPlaylist(playlistID, tracks)
  {
    if (!tracks[0].startsWith('spotify:track:'))
    {
      tracks = tracks.map(trackid => 'spotify:track:' + trackid);
    }

    if (tracks.length <= ADD_TRACK_LIMIT)
    {
      return spotifyAPI.addTracksToPlaylist(playlistID, tracks);
    }

    return this.AddTracksToPlaylist(playlistID, tracks.slice(0, ADD_TRACK_LIMIT))
      .then(() => this.AddTracksToPlaylist(playlistID, tracks.slice(ADD_TRACK_LIMIT)))
      .catch(console.error);
  }

  /**
   * Add all the songs in one playlist to another (making one the subset of another)
   * @param {string} source The id of the playlist that acts as a source of songs
   * @param {string} destination The id of the playlist which will have the songs added to it
   */
  AddPlaylistToPlaylist(source, destination)
  {
    Promise
      .all([_getAllPlaylistTrackIDs(source), _getAllPlaylistTrackIDs(destination)])
      .then(
        ([sourceTracks, destTracks]) =>
        {
          const toAdd = sourceTracks.filter(e => !destTracks.includes(e));
          if (toAdd.length === 0) return;

          console.log(`Adding ${toAdd.length} tracks from ${source} to ${destination}`);
          this.AddTracksToPlaylist(destination, toAdd).catch(console.error);
        })
      .catch(console.err);
  }
}

module.exports = () => new SpotifyWrapper();
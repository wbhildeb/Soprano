const env = require('../../environment');

/**
 * @typedef {Object} AuthCredentials
 * @property {string} authToken - The token used for authentication
 * @property {string} refreshToken - The token used for refreshing credentials
 */

class SpotifyAuthService
{
  constructor(spotifyAPI)
  {
    this.spotifyAPI = spotifyAPI;
  }

  /**
   * @param {string} sessionID The sessionID of the user
   * @param {boolean} [showDialog=false]
   * @returns {string} The URL to get authorization
   */
  CreateURL(sessionID, showDialog)
  {
    showDialog = !!showDialog;
    return this.spotifyAPI.createAuthorizeURL(env.spotify.scopes, sessionID, showDialog);
  }

  /**
   * Get the current authorization and refresh tokens
   * @param {string} code The code returned by a request to the authorization URL
   * @returns {Promise<AuthCredentials>}
   */
  async CreateCredentials(code)
  {
    const authData = (await this.spotifyAPI.authorizationCodeGrant(code)).body;
    return {
      authToken: authData.access_token,
      refreshToken: authData.refresh_token
    };
  }

  /**
   * Retrieves the credentials currently set
   * @returns {AuthCredentials} the currently set credentials
   */
  GetCredentials()
  {
    return {
      authToken: this.spotifyAPI.getAccessToken(),
      refreshToken: this.spotifyAPI.getRefreshToken()
    };
  }

  /**
   * Set the current authentication token and refresh token
   * @param {AuthCredentials} credentials
   */
  SetCredentials(credentials)
  {
    this.spotifyAPI.setAccessToken(credentials.authToken);
    this.spotifyAPI.setRefreshToken(credentials.refreshToken);
  }

  /**
   * Refresh the given credentials (does not update the wrapper's credentials to given values)
   * @param {AuthCredentials} credentials
   * @returns {Promise<AuthCredentials>} null if unable to refresh
   */
  async RefreshCredentials(credentials)
  {
    const oldCredentials = this.GetCredentials();

    this.SetCredentials(credentials);
    const refreshedData = (await this.spotifyAPI.refreshAccessToken()).body;
    this.SetCredentials(oldCredentials);

    return Object.assign(credentials, {authToken: refreshedData.access_token});
  }
}

module.exports = (spotifyAPI) => new SpotifyAuthService(spotifyAPI);

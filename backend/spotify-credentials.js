exports.clientID        = '391e2916ad4a4709908a2d71ffaeb0c5';
exports.clientSecret    = '8bfdab0cdbd841bfb127f58545b90402';
exports.redirectURI     = 'http://localhost:3000/spotify/callback';
exports.scope           = 'user-library-modify user-read-private user-modify-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-private';
exports.stateKey        = 'spotify_auth_state';
exports.authorizeLink   = 'https://accounts.spotify.com/authorize?';
/**
 * Generates a random state
 * @return {string}: The generated state
 */
module.exports.generateState = function()
{
    var length = 16;
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const request = require('request');

exports.clientID        = '391e2916ad4a4709908a2d71ffaeb0c5';
exports.clientSecret    = '8bfdab0cdbd841bfb127f58545b90402';
exports.redirectURI     = 'http://localhost:3000/spotify/callback';
exports.scope           = 'user-library-modify user-read-private user-modify-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-private';
exports.stateKey        = 'spotify_auth_state';
exports.sessionKey      = 'spotify_session'
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



module.exports.requestUser = function(auth_token)
{
    var options = {
        url: 'https://api.spotify.com/v1/me',
        headers: { 'Authorization': 'Bearer ' + auth_token },
        json: true
    };

    return new Promise((resolve, reject) =>
    {
        request.get(options, (err, res, body) =>
        {
            if (err || res.statusCode != 200)
            {
                console.log(err);
                reject(err);
            }
            else
            {
                resolve(body);
            }
        });
    });
}

/**
 * This function returns recently listened to tracks of a user
 * @param {string} auth_token - The authentication token needed by spotify
 * @param {number} limit - The number of tracks to get back (between 1 and 50, inclusive)
 */
module.exports.requestTracks = function(auth_token, limit)
{
    var options = {
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        headers: { 'Authorization' : 'Bearer ' + auth_token },
        limit: limit,
        json: true
    };

    return new Promise((resolve, reject) =>
    {
        request.get(options, (err, res, body) =>
        {
            if (err)
            {
                console.log(err);
            }

            if (res.statusCode != 200)
            {
                console.log("Status code: " + res.statusCode);
            }

            resolve(body);
        });
    });
}
/**
 * spotify.js
 * 
 * Walker Hildebrand
 * February 2019
 * www.walkerhildebrand.com
 */

//////////////////////////////////// Imports ////////////////////////////////////
var SpotifyObject       = require('spotify-web-api-node');

/////////////////////////////////// Settings ///////////////////////////////////
exports.clientID        = '391e2916ad4a4709908a2d71ffaeb0c5';
exports.clientSecret    = '8bfdab0cdbd841bfb127f58545b90402';
exports.redirectURI     = 'http://localhost:3000/spotify/callback';
exports.scope           = 'user-library-modify user-read-private user-modify-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-private';
exports.stateKey        = 'spotify_auth_state';
exports.sessionKey      = 'spotify_session'
exports.authorizeLink   = 'https://accounts.spotify.com/authorize?';

//////////////////////////////////// Models ////////////////////////////////////
const User              = require('./models/user')
const Track             = require('./models/track')

//////////////////////////////// Wrapper Object ////////////////////////////////
var wrapper = new SpotifyObject({
    id: "fuku",
    secret: "asd"
});

/////////////////////////// Basic Request Functions ///////////////////////////
exports.getUser = function(auth_token)
{
    wrapper.setAccessToken(auth_token);
    return new Promise((resolve, reject) =>
    {
        wrapper
            .getMe()
            .then(data =>
            {
                var userData = data.body;
                var user = new User({
                    country:        userData.country,
                    display_name:   userData.display_name,
                    href:           userData.href,
                    id:             userData.id,
                    product:        userData.product,
                    type:           userData.type,
                    uri:            userData.uri
                });

                if (userData.images[0])
                {
                    user.image_url = userData.images[0].url;
                }

                resolve(user);
            });
    });
}

exports.getTracks = function(auth_token)
{
    wrapper.setAccessToken(auth_token);

    return new Promise((resolve, reject) =>
    {
        wrapper
            .getMyRecentlyPlayedTracks({ limit: '2' })
            .then(data =>
            {
                console.log(data);
            });
    });
}

////////////////////////// Advanced Request Functions //////////////////////////
/**
 * Returns all of the tracks listened to between the start and end dates
 * 
 * @param {String} auth_token 
 * @param {Date} start
 * @param {Date} end
 * 
 * @returns {Array<Track>}
 */
exports.getTracksBetween = function(auth_token, start, end)
{
    // TODO: Implement
}
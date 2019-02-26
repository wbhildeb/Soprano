/**
 * spotify.js
 * 
 * Walker Hildebrand
 * February 2019
 * www.walkerhildebrand.com
 */

/////////////////////////////////// Imports ///////////////////////////////////
var SpotifyObject = require('spotify-web-api-node');

//////////////////////////////////// Models ////////////////////////////////////
const User = require('./models/user')
const Track = require('./models/track')

//////////////////////////////// Wrapper Object ////////////////////////////////
var wrapper = new SpotifyObject({
    id: "fuku",
    secret: "asd"
});

/////////////////////////////// Helper Functions ///////////////////////////////
exports.setAccessToken = function (authToken) {
    wrapper.setAccessToken(authToken);
}

/////////////////////////// Basic Request Functions ///////////////////////////
exports.getUser = function () {
    return new Promise((resolve, reject) => {
        wrapper
            .getMe()
            .then(data => {
                var userData = data.body;
                var user = new User({
                    country: userData.country,
                    display_name: userData.display_name,
                    href: userData.href,
                    id: userData.id,
                    product: userData.product,
                    type: userData.type,
                    uri: userData.uri
                });

                if (userData.images[0]) {
                    user.image_url = userData.images[0].url;
                }

                resolve(user);
            });
    });
}
/**
 * 
 * @param {*} options
 * 
 */
const getTracks = async function (options = {}) {
    const data = await wrapper.getMyRecentlyPlayedTracks(options);

    if (!data.body.cursors) {
        return null;
    }

    const tracks = data.body.items.map(trackData => {
        return new Track(
            {
                duration_ms: trackData.track.duration_ms,
                explicit: trackData.track.explicit,
                href: trackData.track.href,
                id: trackData.track.id,
                name: trackData.track.name,
                popularity: trackData.track.popularity,
                played_at: trackData.played_at,
            });
    });

    return {
        tracks: tracks,
        before: data.body.cursors.before,
        after: data.body.cursors.after
    };
}

////////////////////////// Advanced Request Functions //////////////////////////
/**
 * Returns the last tracks listened to, with max of 'limit'.
 * 
 * limit > 0
 * 
 * @param {number} limit 
 * 
 * @returns {Array<Track>}
 */
const getLastTracks = async function (limit = 20) {
    if (limit < 0) limit = 20;

    var before = Date.now();
    var tracks = [];

    while (tracks.length < limit) {
        const numToFetch = (limit > 50) ? 50 : limit;

        var trackData = await getTracks({
            limit: numToFetch,
            before: before,
        });

        if (!trackData) break;

        before = trackData.before;
        tracks = tracks.concat(trackData.tracks);

        if (trackData.tracks.length < numToFetch) break;
    }

    return tracks;
}

const getListenHistory = async function () {
    var tracks = await getLastTracks(1000);
    return tracks.map(track => {
        return { track_id: track.id, played_at: track.played_at };
    });
}

/////////////////////////////////// Exports ///////////////////////////////////
exports.clientID = '391e2916ad4a4709908a2d71ffaeb0c5';
exports.clientSecret = '8bfdab0cdbd841bfb127f58545b90402';
exports.redirectURI = 'http://localhost:3000/spotify/callback';
exports.scope = 'user-library-modify user-read-private user-modify-playback-state user-read-currently-playing user-read-recently-played user-modify-playback-state user-read-private';
exports.stateKey = 'spotify_auth_state';
exports.sessionKey = 'spotify_session'
exports.authorizeLink = 'https://accounts.spotify.com/authorize?';

exports.getLastTracks = getLastTracks;
exports.getTracks = getTracks;
exports.getListenHistory = getListenHistory;
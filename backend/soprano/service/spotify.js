
const env = require('../environment');

const SpotifyAPI = require('spotify-web-api-node');
const spotifyAPI = new SpotifyAPI(env.spotify.clientInfo);

const playlistService = require('./spotify/playlist')(spotifyAPI);
const authService = require('./spotify/auth')(spotifyAPI);
const userService = require('./spotify/user')(spotifyAPI);

module.exports = {
  playlistService,
  authService,
  userService
};

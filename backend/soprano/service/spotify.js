
const env = require('../environment');

const SpotifyAPI = require('spotify-web-api-node');
const client = new SpotifyAPI(env.spotify.clientInfo);

const SpotifyPlaylistService = require('./spotify/playlist')(client);
const SpotifyAuthService = require('./spotify/auth')(client);
const SpotifyUserService = require('./spotify/user')(client);

module.exports = {
  SpotifyPlaylistService,
  SpotifyAuthService,
  SpotifyUserService
};

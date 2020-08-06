
const env = require('../environment');

var client;
if (env.emulateSpotify)
{
  client = require('./spotify/emulator_client');
}
else
{
  const SpotifyAPI = require('spotify-web-api-node');
  client = new SpotifyAPI(env.spotify.info.client);
}

const SpotifyPlaylistService = require('./spotify/playlist')(client);
const SpotifyAuthService = require('./spotify/auth')(client);
const SpotifyUserService = require('./spotify/user')(client);
const SpotifyLibraryService = require('./spotify/library')(client);

module.exports = {
  SpotifyPlaylistService,
  SpotifyAuthService,
  SpotifyUserService,
  SpotifyLibraryService
};

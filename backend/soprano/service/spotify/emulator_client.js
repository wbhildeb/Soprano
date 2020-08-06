const DatabaseEmulatorInterface = require('../../data/emulator_interface');
const root = DatabaseEmulatorInterface.SpotifyRoot();

const WrapInBody = body => ({ body });

class SpotifyEmulatorClient
{
  constructor() {}

  createAuthorizeURL() {}
  getRefreshToken() {}
  getAccessToken() {}
  setRefreshToken() {}
  setAccessToken() {}

  async addTracksToPlaylist() {}
  
  async getUserPlaylists()
  {
    const limit = 50;
    const total = limit;
    const items = (await root.child('playlists').once('value')).val();
    return WrapInBody({limit, total, items});
  }

  async getPlaylistTracks()
  {
    const limit = 50;
    const total = limit;
    const items = (await root.child('tracks').once('value')).val();
    return WrapInBody({limit, total, items});
  }

  async getMe()
  {
    return WrapInBody((await root.child('mockUserID').once('value')).val());
  }
}

module.exports = new SpotifyEmulatorClient();
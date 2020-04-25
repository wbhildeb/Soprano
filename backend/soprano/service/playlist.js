const AuthService = require('./auth');
const { SpotifyPlaylistService } = require('./spotify');

module.exports = class PlaylistService
{
  static async GetAll(sessionID)
  {
    await AuthService.SetUserBySessionID(sessionID);
    return SpotifyPlaylistService.GetPlaylists();
  }
};
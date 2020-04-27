const AuthService = require('./auth');
const { SpotifyPlaylistService } = require('./spotify');

module.exports = class PlaylistService
{
  static async GetAll(userID)
  {
    await AuthService.SetUser(userID);
    return SpotifyPlaylistService.GetPlaylists();
  }
};
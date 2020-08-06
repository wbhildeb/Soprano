const AuthService = require('./auth');
const fs = require('fs');
const { SpotifyLibraryService } = require('./spotify');

module.exports = class PlaylistService
{
  static async GetAll(userID)
  {
    await AuthService.SetUser(userID);
    const tracks = await SpotifyLibraryService.GetAllTracks();
    fs.writeFileSync('./tracks.json', JSON.stringify(tracks));
  }
};
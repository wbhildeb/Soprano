const { SubPlaylistDataInterface } = require('../data/interface');
const { SpotifyPlaylistService } = require('../service/tree');
const AuthService = require('../service/auth');
const TreeService = require('../service/tree');


module.exports = class SubPlaylistService
{
  static async UpdateAll()
  {
    const userPlaylists = await SubPlaylistDataInterface.GetParentPlaylists();
    
    Object
      .keys(userPlaylists)
      .forEach(async userID =>
      {
        await AuthService.SetUserByID(userID);
        TreeService
          .PostOrder(TreeService.Treeify(userPlaylists[userID].playlists))
          .forEach(async pair =>
          {
            await SpotifyPlaylistService.CopyTracks(pair.child, pair.parent);
          });
      });
  }
};

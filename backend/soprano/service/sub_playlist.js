const { SubPlaylistDataInterface } = require('../data/interface');
const { SpotifyPlaylistService } = require('./tree');
const AuthService = require('./auth');
const TreeService = require('./tree');


module.exports = class SubPlaylistService
{
  static async UpdateAll()
  {
    const userPlaylists = SubPlaylistDataInterface.GetAllParentPlaylists();
    
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

  static async GetParentPlaylists(userID, playlistID)
  {
    return (await SubPlaylistDataInterface.GetParentPlaylists(userID, playlistID));
  }

  static async GetSubPlaylists(userID, playlistID)
  {
    return (await SubPlaylistDataInterface.GetSubPlaylists(userID, playlistID));
  }

  static async PairPlaylists(userID, parentPlaylistID, childPlaylistID)
  {
    await SubPlaylistDataInterface.PairPlaylists(userID, parentPlaylistID, childPlaylistID);
  }

  static async UnpairPlaylists(userID, parentPlaylistID, childPlaylistID) 
  {
    await SubPlaylistDataInterface.UnpairPlaylists(userID, parentPlaylistID, childPlaylistID);
  }

  static async GetSubPlaylistRelations(userID)
  {
    return (await SubPlaylistDataInterface.GetSubPlaylistRelations(userID));
  }

  static async GetAllParentPlaylists()
  {
    return SubPlaylistDataInterface.GetAllParentPlaylists();
  }
};

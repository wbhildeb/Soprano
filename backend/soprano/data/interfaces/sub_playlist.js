class SubPlaylistDataInterface
{
  constructor(database)
  {
    this.ref = require('../db_reference')(database);
  }

  /**
   * @param {string} userId
   * @param {string} playlistId
   * reterives parents of playlist with id playlistId for userId
   */
  async GetParentPlaylists(userId, playlistId)
  {
    return (await this.db.UserSubPlaylists(userId).child(playlistId).once('value')).val();
  }

  /**
   * @param {string} userId
   * @param {string} playlistId
   * reterives subplaylists of playlist with id playlistId for userId
   */
  async GetSubPlaylists(userId, playlistId)
  {
    return (await this.db.UserPlaylists(userId).child(playlistId).once('value')).val();
  }
  
  /**
   * @param {string} userId
   * @param {string} pPlaylistId
   * @param {string} playlistId
   * pairs two playlists so that all songs in the child playlist 
   * will be added to the parent playlist   
   */
  async PairPlaylists(userId, pPlaylistId, playlistId)
  {
    // TODO: Circular dependency check

    const updatePlaylists = this.ref.UserPlaylists(userId).update(pPlaylistId,{[playlistId]:true});
    const updateSubPlaylists = this.ref.UserSubPlaylists(userId).update(playlistId,{[pPlaylistId]:true});

    await Promise.all([
      updatePlaylists,
      updateSubPlaylists
    ]);
  }

  /**
   * @param {string} userId
   * @param {string} pPlaylistId
   * @param {string} playlistId
   * unpairs two playlists 
   */
  async UnpairPlaylists(userId, pPlaylistId, playlistId)
  {
    const removeInPlaylists = this.ref.UserPlaylists(userId).child(pPlaylistId).child(playlistId).remove();
    const removeInSubPlaylists = this.ref.UserSubPlaylists(userId).child(playlistId).child(pPlaylistId).remove();

    await Promise.all([
      removeInPlaylists,
      removeInSubPlaylists
    ]);
  }

  /**
   * @param {string} userId 
   * returns the playlists, subplaylists denormalized structure for a given userId
   */
  async GetSubPlaylistRelations(userId) 
  {
    return (await this.db.SubPlaylists().child(userId).once('value')).val();
  }

  /**
   * Gets all parent playlists for all users
   */
  async GetAllParentPlaylists()
  {
    const data = await this.ref.SubPlaylists().once('value');
    const users = data.val();
    Object.keys(users).forEach(
      user =>
      {
        delete users[user].sub_playlists;
      }
    );

    return users;
  }
}


/**
 * @returns {SubPlaylistDataInterface}
 */
module.exports = database => new SubPlaylistDataInterface(database);

class SubPlaylistDataInterface
{
  constructor(database)
  {
    this.ref = require('../db_reference')(database);
  }

  /**
   * @param {string} userID
   * @param {string} playlistID
   * reterives parents of playlist with id playlistId for userId
   */
  async GetParentPlaylists(userID, playlistID)
  {
    return (await this.ref
      .UserSubPlaylists(userID)
      .child(playlistID)
      .once('value')).val();
  }

  /**
   * @param {string} userID
   * @param {string} playlistID
   * reterives subplaylists of playlist with id playlistId for userId
   */
  async GetSubPlaylists(userID, playlistID)
  {
    return (await this.ref
      .UserParentPlaylists(userID)
      .child(playlistID)
      .once('value')).val();
  }
  
  /**
   * @param {string} userID
   * @param {string} parentPlaylistID
   * @param {string} childPlaylistID
   * pairs two playlists so that all songs in the child playlist 
   * will be added to the parent playlist   
   */
  async PairPlaylists(userID, parentPlaylistID, childPlaylistID)
  {
    // TODO: Circular dependency check

    const updatePlaylists = this.ref
      .UserParentPlaylists(userID)
      .update(parentPlaylistID,{[childPlaylistID]:true});

    const updateSubPlaylists = this.ref
      .UserSubPlaylists(userID)
      .update(childPlaylistID,{[parentPlaylistID]:true});

    await Promise.all([
      updatePlaylists,
      updateSubPlaylists
    ]);
  }

  /**
   * @param {string} userID
   * @param {string} parentPlaylistID
   * @param {string} childPlaylistID
   * unpairs two playlists 
   */
  async UnpairPlaylists(userID, parentPlaylistID, childPlaylistID)
  {
    const removeInPlaylists = this.ref
      .UserParentPlaylists(userID)
      .child(parentPlaylistID)
      .child(childPlaylistID)
      .remove();

    const removeInSubPlaylists = this.ref
      .UserSubPlaylists(userID)
      .child(childPlaylistID)
      .child(parentPlaylistID)
      .remove();

    await Promise.all([
      removeInPlaylists,
      removeInSubPlaylists
    ]);
  }

  /**
   * @param {string} userID 
   * returns the playlists, subplaylists denormalized structure for a given userId
   */
  async GetSubPlaylistRelations(userID) 
  {
    return (await this.ref
      .SubPlaylists()
      .child(userID)
      .once('value')).val();
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

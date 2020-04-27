class SubPlaylistDataInterface
{
  constructor(database)
  {
    this.ref = require('../db_reference')(database);
  }

  /**
   * @param {string} userID
   * @param {string} playlistID
   * @return {Promise<JSON>} resolves to an object containing the parents of subplaylist in the 
   * form {{'parentid1': true}, {'parentid2': true}} if the user has playlistID as a subplaylist 
   * and rejects otherwise
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
   * @return {Promise<JSON>} resolves to an object containing the children of a playlist in the
   * form {{'childid1': true}, {'childid2': true}} if the user has playlistID as a parent playlist 
   * and rejects otherwise
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
   * @returns {Promise} resolves once the database has been updated with the new pairing
   */
  async PairPlaylists(userID, parentPlaylistID, childPlaylistID)
  {
    console.log(userID, parentPlaylistID, childPlaylistID);
    // TODO: Circular dependency check

    const updatePlaylists = this.ref
      .UserParentPlaylists(userID)
      .child(parentPlaylistID)
      .update({[childPlaylistID]:true});

    const updateSubPlaylists = this.ref
      .UserSubPlaylists(userID)
      .child(childPlaylistID)
      .update({[parentPlaylistID]:true});

    await Promise.all([
      updatePlaylists,
      updateSubPlaylists
    ]);
  }

  /**
   * @param {string} userID
   * @param {string} parentPlaylistID
   * @param {string} childPlaylistID
   * @returns {Promise} resolves once the pairing has been removed from the database
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
   * @returns {Promise<JSON>} returns the Subplaylist structure for a user
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
   * @returns {JSON} of all parent playlists for all users 
   */
  async GetAllParentPlaylists()
  {
    const data = await this.ref.SubPlaylists().once('value');
    const users = data.val();
    Object.keys(users).forEach(
      user =>
      {
        delete users[user].subPlaylists;
      }
    );

    return users;
  }
}

/**
 * @returns {SubPlaylistDataInterface}
 */
module.exports = database => new SubPlaylistDataInterface(database);

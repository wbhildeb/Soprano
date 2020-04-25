class SubPlaylistDataInterface
{
  constructor(database)
  {
    this.db = require('../db_reference')(database);
  }

  /**
   * Gets all parent playlists for all users
   */
  async GetParentPlaylists()
  {
    const data = await this.db.SubPlaylists().once('value');
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

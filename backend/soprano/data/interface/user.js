const EncryptionService = require('../../service/encryption');

class UserDataInterface
{
  constructor(database)
  {
    this.db = require('../db_reference')(database);
  }

  /**
   * @typedef {Object} AuthCredentials
   * @property {string} authToken - The token used for authentication
   * @property {string} refreshToken - The token used for refreshing credentials
   */

  /**
   * Encrypts and updates the authentication credentials for a user,
   *  and creates a new user if none exists with given userID
   * @param {string} userID
   * @param {AuthCredentials} credentials
   */
  async UpdateAuthCredentials(userID, credentials)
  {
    const encryptedCreds = Object.assign({}, credentials);
    await EncryptionService.EncryptObject(encryptedCreds);
    this.db.User(userID).update({credentials: encryptedCreds});
  }

  /**
   * Gets and decrypts user credentials
   * @param {string} userID the spotify user ID to look for
   * @returns {AuthCredentials}
   */
  async GetUserCredentials(userID)
  {
    const data = await this.db.UserCredentials(userID).once('value');
    const credentials = data.val();
    await EncryptionService.DecryptObject(credentials);
    return credentials;
  }

  /**
   * Retrives all User_Metadata objects
   */
  async GetUsers()
  {
    return this.db.UserMetadata().once('value');
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
 * @returns {UserDI}
 */
module.exports = (database) => new UserDataInterface(database);

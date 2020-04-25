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
   * @returns {Promise} resolves when the credentials have been updated
   */
  async UpdateAuthCredentials(userID, credentials)
  {
    const encryptedCreds = Object.assign({}, credentials);
    await EncryptionService.EncryptObject(encryptedCreds);
    await this.db.User(userID).update({credentials: encryptedCreds});
  }

  /**
   * Gets and decrypts user credentials
   * @param {string} userID the spotify user ID to look for
   * @returns {Promise<AuthCredentials>}
   */
  async GetUserCredentials(userID)
  {
    const credentials = (await this.db.UserCredentials(userID).once('value')).val();
    await EncryptionService.DecryptObject(credentials);
    return credentials;
  }

  /**
   * Retrives all UserMetadata objects
   */
  async GetUsers()
  {
    return (await this.db.UserMetadata().once('value')).val();
  }
}

/**
 * @returns {UserDataInterface}
 */
module.exports = (database) => new UserDataInterface(database);

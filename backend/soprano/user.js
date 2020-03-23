
class UserDbInterface
{
  constructor(database)
  {
    this.metadataRef = database.ref('User_Metadata');
    this.playlistRef = database.ref('User_Playlists');
    this.encryption = require('./encryption')();
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
  UpdateAuthCredentials(userID, credentials)
  {
    this.encryption
      .EncryptCredentials(credentials)
      .then(
        credentials =>
        {
          this.metadataRef
            .child(`${userID}`)
            .update({credentials});
        }
      ); 
  }

  /**
   * Gets and decrypts user credentials
   * @param {string} userID the spotify user ID to look for
   * @returns {Promise<AuthCredentials>}
   */
  GetUserCredentials(userID)
  {
    return new Promise(
      (resolve, reject) =>
      {
        this.metadataRef
          .child(`${userID}/credentials`)
          .once('value')
          .then(
            data =>
            {
              if (!data.exists()) reject(`No user with entry '${userID}'`);
              else 
              {
                return data.val();
              }
            })
          .then(
            credentials => this.encryption.DecryptCredentials(credentials)
          )
          .then(
            decryptedCreds =>
            {
              console.log('decryptedCreds:',decryptedCreds);
              resolve(decryptedCreds);
            },
            reject
          );
      });
  }

  /**
   * Retrives all User_Metadata objects
   */
  GetUsers()
  {
    return this.metadataRef.once('value');
  }

  /**
   * Gets all parent playlists for all users
   */
  GetParentPlaylists()
  {
    return this.playlistRef
      .once('value')
      .then(
        userSnapshot =>
        {
          const users = userSnapshot.val();
          Object.keys(users).forEach(
            user =>
            {
              delete users[user].sub_playlists;
            }
          );
          return users;
        }
      );
  }
}

/**
 * @returns {UserDbInterface}
 */
module.exports = (database) => new UserDbInterface(database);
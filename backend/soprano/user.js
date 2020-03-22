
class UserDbInterface
{
  constructor(database)
  {
    this.metadataRef = database.ref('User_Metadata');
    this.playlistRef = database.ref('User_Playlists');
  }

  /**
   * @typedef {Object} AuthCredentials
   * @property {string} authToken - The token used for authentication
   * @property {string} refreshToken - The token used for refreshing credentials
   */

  /**
   * Updates the authentication credentials for a user,
   *  and creates a new user if none exists with given userID
   * @param {string} userID
   * @param {AuthCredentials} credentials
   */
  UpdateAuthCredentials(userID, credentials)
  {
    this.metadataRef
      .child(`${userID}`)
      .update({credentials});
  }

  /**
   * Retrieves the User_Metadata object with the associated userID
   * @param {string} userID the spotify user ID to look for
   * @returns {Promise<User>}
   */
  GetUser(userID)
  {
    return new Promise(
      (resolve, reject) =>
      {
        this.metadataRef
          .child(`${userID}`)
          .once('value')
          .then(
            data =>
            {
              if (data.exists()) resolve(data.val());
              else reject(`No user with entry '${userID}'`);
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
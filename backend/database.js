const firebase = require('firebase');
const environment = require('../environments/environment');

firebase.initializeApp(environment.firebaseConfig);

class Database
{
  /**
   * @typedef {Object} User
   * @property {string} authToken - The token used for authentication
   * @property {string} refreshToken - The token used for refreshing credentials
   */

  /**
   * TODO: Comments
   * @param {*} sessionID 
   * @param {*} userID 
   */
  SaveSession(sessionID, userID)
  {
    // Make a session
    firebase
      .database()
      .ref(`Sessions/${sessionID}`)
      .set({
        UserID: userID
      });
    
    
    // session
    // Break any links between 'sessionID' and other users
    // If user with id: 'userID' does not exist, initialize a new user
    // Link the user and the session ID
  }

  /**
   * TODO: Comments
   * @param {string} userID 
   * @param {string} authToken 
   * @param {string} refreshToken 
   */
  UpdateAuthenticationInfo(userID, authToken, refreshToken) 
  {

  }

  /**
   * TODO: Comments
   * @param {string} sessionID 
   * @returns {Promise<string>} spotify user id
   */
  GetUserID(sessionID) 
  {
    return new Promise(
      (resolve, reject) =>
      {
        firebase
          .database()
          .ref(`Sessions/${sessionID}`)
          .once('value')
          .then(
            data =>
            {
              if (data.val() && data.val().UserID) resolve(data.val().UserID);
              else reject(`Unable to get user id: no entry with session id '${sessionID}'`);
            },
            err => { reject('Unable to get user id: ' + err); }
          );
      });
  }

  /**
   * TODO: Comments
   * @param {string} userID 
   * @returns {User}
   */
  GetUser(userID) 
  {

  }
}

/**
 * @returns {Database}
 */
module.exports = () => new Database();

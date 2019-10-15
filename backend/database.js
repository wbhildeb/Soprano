const firebase = require('firebase');

firebase.initializeApp({
  apiKey: 'AIzaSyCF-LkQmXiN32_40jJgN4hxyqnojBorTPw',
  authDomain: 'spotify-24cc8.firebaseapp.com',
  databaseURL: 'https://spotify-24cc8.firebaseio.com',
  projectId: 'spotify-24cc8',
  storageBucket: '',
  messagingSenderId: '917844942595',
  appId: '1:917844942595:web:aa0c30595a95ab48625336',
  measurementId: 'G-X20F0RDS21'
});

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
        // TODO: Make this actually connect to the database
        if (sessionID == '1234567890')
        {
          resolve('cjsn83u3');
        }
        else
        {
          reject('No user in database for session id: ' + sessionID);
        }
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

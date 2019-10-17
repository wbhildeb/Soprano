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

const db = firebase.database();

class Database {
  /**
   * TODO: Comments
   * @param {*} sessionID 
   * @param {*} userID 
   */
  SaveSession(sessionID, userID) {
    // session
    // Break any links between 'sessionID' and other users
    // If user with id: 'userID' does not exist, initialize a new user
    // Link the user and the session ID
    var updates = {};

    updates['/Sessions/'] = { [sessionID]: userID };
    updates[`/User_Metadata/${userID}/Sessions/`] = { [sessionID]: true };

    db
      .ref()
      .update(updates);
  }

  /**
   * TODO: Comments
   * @param {string} userID 
   * @param {string} authToken 
   * @param {string} refreshToken 
   */
  //Will create a new user if userID does not exist.
  UpdateAuthenticationInfo(userID, authToken, refreshToken) {
    db
      .ref(`/User_Metadata/${userID}/`)
      .update({ authToken: authToken, refreshToken: refreshToken });
  }

  /**
   * TODO: Comments
   * @param {string} sessionID 
   * @returns {string} spotify user id
   */
  //returns a promise, keeps listening. Can add logic inside function to deal with change. Change to ONCE to stop listening
  async GetUserID(sessionID) {
    return new Promise(
      (resolve, reject) => {
        db
          .ref(`Sessions/${sessionID}`)
          .on('value', function (data) {
            if (data.exists) {
              resolve(data.val());
              console.log('User exists:', data.val());
            }
            else {
              reject(`Unable to get user id: no entry with session id '${sessionID}'`);
              console.log('User not found')
            }
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
  GetUser(userID) {
    return new Promise(
      (resolve, reject) => {
        db
          .ref(`/User_Metadata/${userID}`)
          .on('value', function (data) {
            if (data.exists) {
              resolve(data.val());
              console.log('User exists, metadata:', data.val());
            }
            else {
              reject(`Unable to get user metadata: no user with entry '${userID}`);
              console.log('User not found. UserID', userID);
            }
          },
            err => { reject('Unable to get user id: ' + err); }
          );
      });
  }
}

/**
 * @returns Database
 */
module.exports = () => new Database();

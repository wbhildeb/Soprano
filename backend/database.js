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
      .update({authToken: authToken, refreshToken: refreshToken});
  }

  /**
   * TODO: Comments
   * @param {string} sessionID 
   * @returns {string} spotify user id
   */
  //returns a promise
   async GetUserID(sessionID)  {
     var userID;
     await db
      .ref(`/Sessions/${sessionID}`)
      .on('value', function(value){
        userID = value.val();
      });
      return userID;
  }

  /**
   * TODO: Comments
   * @param {string} userID 
   * @returns {User}
   */
  GetUser(userID) {
    var rval;
    db
      .ref(`/User_Metadata/${userID}`)
      .on('value', function(value){
        rval = value.val();
        console.log(value.val());
      });
    return rval;
  }

}

/**
 * @returns Database
 */
module.exports = () => new Database();

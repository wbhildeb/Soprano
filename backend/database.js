const firebase = require('firebase');
const environment = require('../environments/environment');

firebase.initializeApp(environment.firebaseConfig);
const db = firebase.database();

class Database 
{
  /**
   * @typedef {Object} User
   * @property {string} authToken - The token used for authentication
   * @property {string} refreshToken - The token used for refreshing credentials
   * TODO: Complete
   */

  /**
   * @typedef {Object} AuthCredentials
   * @property {string} authToken - The token used for authentication
   * @property {string} refreshToken - The token used for refreshing credentials
   */


  /**
   * Connects the sessionID to the given user, and breaks any 
   *   existing connections with sessionID
   * @param {string} sessionID 
   * @param {string} userID 
   */
  SaveSession(sessionID, userID) 
  {
    // Disconnect if the sessionID already exists, remove it in oldUserID
    this
      .GetUserID(sessionID)
      .then(
        oldUserID =>
        {
          // No need to update, already as it should be
          if (oldUserID === userID) return;

          // Delete the old connection between sessionID and oldUserID
          db
            .ref(`/User_Metadata/${oldUserID}/Sessions/${sessionID}`)
            .remove();
        }
      );

    // Connect sessionID and userID
    db.ref().update({
      [`/Sessions/${sessionID}`]: userID,
      [`/User_Metadata/${userID}/Sessions/${sessionID}`]: true
    });
  }

  /**
   * Updates the authentication credentials for a user,
   *  and creates a new user if none exists with given userID
   * @param {string} userID
   * @param {AuthCredentials} creds 
   */
  UpdateAuthCredentials(userID, creds) 
  {
    db
      .ref(`/User_Metadata/${userID}/`)
      .update(creds);
  }

  /**
   * TODO: Comments
   * @param {string} sessionID 
   * @returns {Promise<string>} spotify user id
   */
  //returns a promise, keeps listening. Can add logic inside function to deal with change. Change to ONCE to stop listening
  GetUserID(sessionID) 
  {
    return new Promise(
      (resolve, reject) => 
      {
        db
          .ref(`Sessions/${sessionID}`)
          .once('value', (data) => 
          {
            if (data.exists()) 
            {
              resolve(data.val());
              console.log('User exists:', data.val());
            }
            else 
            {
              reject(`Unable to get user id: no entry with session id '${sessionID}'`);
              console.log('User not found');
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
  GetUser(userID) 
  {
    return new Promise(
      (resolve, reject) => 
      {
        db
          .ref(`/User_Metadata/${userID}`)
          .once('value', (data) => 
          {
            if (data.exists()) 
            {
              resolve(data.val());
              console.log('User exists, metadata:', data.val());
            }
            else 
            {
              reject(`Unable to get user metadata: no user with entry '${userID}`);
              console.log('User not found. UserID', userID);
            }
          },
          err => { reject('Unable to get user id: ' + err); }
          );
      });
  }

  /**
   * Delete all sessions in Sessions/ and User_Metadata/
   */
  DeleteSessionData() 
  {
    // Delete stored sessions
    db
      .ref('/Sessions/')
      .remove();

    // Delete session references in User_Metadata/
    db
      .ref('/User_Metadata/')
      .once('value')
      .then((users) => 
      {
        users.forEach((user) => 
        {
          db
            .ref(`/User_Metadata/${user.key}/Sessions/`)
            .remove();
        });
      });
  }

  /**
   * Delete all user sessions in Sessions/ and User_Metadata/
   */
  DeleteUserSessions(userID) 
  {
    var ref = db
      .ref(`User_Metadata/${userID}/Sessions/`);

    ref
      .once('value')
      .then((sessions) =>
        sessions.forEach((session) => 
        {
          console.log(session.key);
          db
            .ref(`Sessions/${session.key}/`)
            .remove();
        }
        ));
    ref
      .remove();
  }

  /**
   * TODO: Comments
   * @param {string} sessionID 
   * @param {string} userID 
   */

}

/**
 * @returns {Database}
 */
module.exports = () => new Database();

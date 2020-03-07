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
   * @property {Sessions} sessions
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
   * @param {AuthCredentials} credentials
   */
  UpdateAuthCredentials(userID, credentials)
  {
    db
      .ref(`/User_Metadata/${userID}/`)
      .update({credentials});
  }

  /**
   * Fetches the spotify user ID associated with the given session
   * @param {string} sessionID
   * @returns {Promise<string>} resolves to the spotify user ID connected to the
   *   session and rejects if no session with the given session ID exists
   */
  GetUserID(sessionID)
  {
    return new Promise(
      (resolve, reject) =>
      {
        db
          .ref(`Sessions/${sessionID}`)
          .once('value')
          .then(
            data =>
            {
              if (data.exists()) resolve(data.val());
              else reject(`No session with id '${sessionID}'`);
            },
            reject
          );
      });
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
        db
          .ref(`/User_Metadata/${userID}`)
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
   *
   */
  GetUsers()
  {
    return db.ref('/User_Metadata/').once('value');
  }

  /**
   * Delete all sessions in Sessions/ and User_Metadata/
   */
  DeleteSessionData()
  {
    // Delete stored sessions
    db.ref('/Sessions/').remove();

    // Delete session references in User_Metadata/
    db.ref('/User_Metadata/')
      .once('value')
      .then(
        users =>
        {
          users.forEach(user =>
          {
            db.ref(`/User_Metadata/${user.key}/Sessions/`)
              .remove();
          });
        },
        console.error
      );
  }

  /**
   * Delete all user sessions in Sessions/ and User_Metadata/
   * @param {string} userID
   */
  DeleteUserSessions(userID)
  {
    var sessionsNode = db.ref(`User_Metadata/${userID}/Sessions/`);

    sessionsNode
      .once('value')
      .then(
        sessions =>
        {
          sessions.forEach(session =>
          {
            db
              .ref(`Sessions/${session.key}/`)
              .remove();
          });
        },
        err => console.error('Failed to delete user sessions', err)
      );

    sessionsNode.remove();
  }

  /**
   *
   */
  GetParentPlaylists()
  {
    return db
      .ref('/User_Playlists/')
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
 * @returns {Database}
 */
module.exports = () => new Database();

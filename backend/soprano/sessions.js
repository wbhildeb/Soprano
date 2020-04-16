class SessionDbInterface
{
  constructor(database) 
  {
    this.dbRef = require('./dbRef')(database);
  }

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
          this.dbRef
            .userSession(oldUserID, sessionID)
            .remove();
        }
      );

    // Connect sessionID and userID
    this.dbRef.sessionsRef()
      .update({[`${sessionID}`]: userID});

    this.dbRef.userSessions(userID)
      .update({[`${sessionID}`]: true});
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
        this.dbRef
          .session(sessionID)
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
   * Delete all sessions in Sessions/ and User_Metadata/
   */
  DeleteSessionData()
  {
    // Delete stored sessions
    this.dbRef.sessionsRef().remove();

    // Delete session references in User_Metadata/
    this.dbRef
      .metadataRef()
      .once('value')
      .then(
        users =>
        {
          users.forEach(user =>
          {
            this.dbRef
              .userSessions(user.key)
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
    var sessionsNode = this.dbRef.userSessions(userID);

    sessionsNode
      .once('value')
      .then(
        sessions =>
        {
          sessions.forEach(session =>
          {
            this.dbRef
              .session(session.key)
              .remove();
          });
        },
        err => console.error('Failed to delete user sessions', err)
      );
    sessionsNode.remove();
  }

  /**
   * Delete the session id under sessions and user metadata
   * @param {string} sessionID
   */
  DeleteSession(sessionID)
  {
    this.GetUserID(sessionID)
      .then(userID =>
      {
        if (userID)
        {
          this.dbRef.userSession(userID, sessionID).remove();
          this.dbRef.session(sessionID).remove();
        }
      });
  }
}

/**
 * @returns {SessionDbInterface}
 */
module.exports = (database) => new SessionDbInterface(database);
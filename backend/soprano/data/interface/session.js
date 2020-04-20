class SessionDataInterface
{
  constructor(database)
  {
    this.db = require('../db_reference')(database);
  }

  /**
   * Connects the sessionID to the given user, and breaks any
   *   existing connections with sessionID
   * @param {string} sessionID
   * @param {string} userID
   */
  async SaveSession(sessionID, userID)
  {
    const oldUserID = await this.GetUserID(sessionID);
    if (oldUserID === userID)
    {
      // Already set
      return;
    }

    this.db.UserSession(oldUserID, sessionID).remove();

    // Connect sessionID and userID
    this.db.Sessions()
      .update({[`${sessionID}`]: userID});

    this.db.UserSessions(userID)
      .update({[`${sessionID}`]: true});
  }

  /**
   * Fetches the spotify user ID associated with the given session
   * @param {string} sessionID
   * @returns {string} resolves to the spotify user ID connected to the
   *   session and rejects if no session with the given session ID exists
   */
  async GetUserID(sessionID)
  {
    const data = await this.db.Session(sessionID).once('value');
    return data.exists() ? data.val() : null;
  }

  /**
   * Delete all sessions in under Sessions and UserMetadata
   */
  async DeleteSessionData()
  {
    // Delete stored sessions
    this.db.Sessions().remove();

    // Delete session references in UserMetadata
    const userMetadata = await this.db.UserMetadata().once('value');
    userMetadata.forEach(user =>
    {
      this.db.UserSession(user.key).remove();
    });
  }

  /**
   * Delete all user sessions under Sessions and UserMetadata
   * @param {string} userID
   */
  async DeleteUserSessions(userID)
  {
    var sessionsNode = this.db.UserSessions(userID);
    const sessions = await sessionsNode.once('value');

    sessions.forEach(session =>
    {
      this.db.Session(session.key).remove();
    });

    sessionsNode.remove();
  }

  /**
   * Delete the session id under sessions and user metadata
   * @param {string} sessionID
   */
  DeleteSession(sessionID)
  {
    const userID = await this.GetUserID(sessionID);
    if (userID)
    {
      this.dbRef.userSession(userID, sessionID).remove();
      this.dbRef.session(sessionID).remove();
    }
  }
}

/**
 * @returns {SessionDataInterface}
 */
module.exports = database => new SessionDataInterface(database);

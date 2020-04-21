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
  async Save(sessionID, userID)
  {
    const oldUserID = await this.GetUserID(sessionID);
    if (oldUserID === userID) return;
    
    var removeOld = null;
    if (oldUserID) 
    {
      removeOld = this.db.UserSession(oldUserID, sessionID).remove();
    }

    const updateSessions = this.db.Sessions().update({[`${sessionID}`]: userID});
    const updateUserMetadata = this.db.UserSessions(userID).update({[`${sessionID}`]: true});

    await Promise.all([
      removeOld,
      updateSessions,
      updateUserMetadata
    ]);
  }

  /**
   * Fetches the spotify user ID associated with the given session
   * @param {string} sessionID
   * @returns {string} resolves to the spotify user ID connected to the
   *   session and rejects if no session with the given session ID exists
   */
  async GetUserID(sessionID)
  {
    return (await this.db.Session(sessionID).once('value')).val();
  }

  /**
   * Delete all sessions in under Sessions and UserMetadata
   */
  async DeleteAll()
  {
    // Delete under UserMetadata/
    const userMetadata = (await this.db.UserMetadata().once('value')).val();
    const deletes = Object
      .keys(userMetadata)
      .map(id => this.db.UserSessions(id).remove());
      
    // Delete under Sessions/
    deletes.push(this.db.Sessions().remove());

    await Promise.all(deletes);
  }

  /**
   * Delete all user sessions under Sessions and UserMetadata
   * @param {string} userID
   */
  async DeleteForUser(userID)
  {
    var sessionsNode = this.db.UserSessions(userID);
    const sessions = (await sessionsNode.once('value')).val();

    if (sessions === null) return;

    const deletes = Object.keys(sessions).map(sessionID =>
      this.db.Session(sessionID).remove()
    );

    deletes.push(sessionsNode.remove());

    await Promise.all(deletes);
  }

  /**
   * Delete the session id under sessions and UserMetadata
   * @param {string} sessionID
   */
  async Delete(sessionID)
  {
    const userID = await this.GetUserID(sessionID);
    await Promise.all([
      this.db.Session(sessionID).remove(),
      userID ? this.db.UserSession(userID, sessionID).remove() : null
    ]);
  }
}

/**
 * @returns {SessionDataInterface}
 */
module.exports = database => new SessionDataInterface(database);

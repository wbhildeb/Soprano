class Database
{
  /**
   * TODO: Comments
   * @param {*} sessionID 
   * @param {*} userID 
   */
  SaveSession(sessionID, userID)
  {
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
   * @returns {string} spotify user id
   */
  GetUserID(sessionID) 
  {
    // return the user ID associated with the session ID
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
 * @returns Database
 */
module.exports = () => new Database();

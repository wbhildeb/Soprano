/**
 * 
 */
class Database
{
  /**
   * 
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

  UpdateAuthenticationInfo(userID, authToken, refreshToken) 
  {

  }

  GetUserID(sessionID) 
  {
    // return the user ID associated with the session ID
  }

  GetUser(userID) 
  {

  }
}
/**
 * @returns Database
 */
exports.database();
{
  return new Database();
}



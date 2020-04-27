
const AuthService = require('./auth');
const { SpotifyUserService } = require('./spotify');
const { SessionDataInterface } = require('../data/interface');

module.exports = class UserService
{
  /**
   * Get the user ID associated with the given session
   * @param {string} sessionID 
   * @returns {Promise<string>}
   */
  static async GetID(sessionID)
  {
    return SessionDataInterface.GetUserID(sessionID);
  }

  /**
   * Return details of the user's Spotify account
   * @param {string} sessionID 
   * @returns {Promise<Object>}
   */
  static async GetDetails(userID)
  {
    await AuthService.SetUser(userID);
    return SpotifyUserService.GetInfo();
  }
};

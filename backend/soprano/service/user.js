
const AuthService = require('./auth');
const { SpotifyUserService } = require('./spotify');
const { SessionDataInterface } = require('../data/interface');

module.exports = class UserService
{
  /**
   * 
   * @param {string} sessionID 
   * @returns {Promise<string>}
   */
  static async GetID(sessionID)
  {
    return SessionDataInterface.GetUserID(sessionID);
  }

  /**
   * 
   * @param {string} sessionID 
   * @returns {Promise<Object>}
   */
  static async GetDetails(sessionID)
  {
    await AuthService.SetUserBySessionID(sessionID);
    return SpotifyUserService.GetInfo();
  }
};

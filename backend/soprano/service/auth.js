
const { SpotifyAuthService, SpotifyUserService } = require('../service/spotify');
const { SessionDataInterface, UserDataInterface } = require('../data/interface');

module.exports = class AuthService
{
  static GetLoginRedirectURL(sessionID)
  {
    return SpotifyAuthService.CreateURL(sessionID, false);
  }

  static GetNotMeRedirectURL(sessionID)
  {
    return SpotifyAuthService.CreateURL(sessionID, true);
  }

  static async Logout(sessionID)
  {
    await SessionDataInterface.Delete(sessionID);
  }

  static async AddNewSession(sessionID, code)
  {
    const credentials = await SpotifyAuthService.CreateCredentials(code);
    SpotifyAuthService.SetCredentials(credentials);

    const userID = (await SpotifyUserService.GetInfo()).id;
    await Promise.all([
      SessionDataInterface.Save(sessionID, userID),
      UserDataInterface.UpdateAuthCredentials(userID, credentials)
    ]);
  }

  static async SetUser(userID)
  {
    const credentials = await UserDataInterface.GetUserCredentials(userID);
    SpotifyAuthService.SetCredentials(credentials);
  }

  static async UpdateAllCredentials()
  {
    const users = await UserDataInterface.GetUsers();
  
    const promises = Object
      .entries(users)
      .map(async ([userID, userData]) =>
      {
        if (!userData.credentials) return;

        const refreshed = await SpotifyAuthService.RefreshCredentials(userData.credentials);
        return UserDataInterface.UpdateAuthCredentials(userID, refreshed);
      });

    await Promise.all(promises);
  }
};
class SpotifyUserService
{
  constructor(spotifyAPI)
  {
    this.spotifyAPI = spotifyAPI;
  }

  /**
   * Returns user details
   * @returns {Promise<Object>}
   */
  async GetInfo()
  {
    return (await this.spotifyAPI.getMe()).body;
  }
}

module.exports = (spotifyAPI) => new SpotifyUserService(spotifyAPI);

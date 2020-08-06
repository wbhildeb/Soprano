const TRACK_FETCH_LIMIT = 50;

class SpotifyLibraryService
{
  constructor(spotifyAPI)
  {
    this.spotifyAPI = spotifyAPI;
  }

  /**
   * Get all of the track IDs of a particular playlist
   * @param {string} playlistID 
   * @returns {string[]}
   */
  async GetAllTracks()
  {
    var offset = 0;
    const tracks = [];

    while (true)
    {
      const trackData = (await this.spotifyAPI.getMySavedTracks({
        offset,
        limit: TRACK_FETCH_LIMIT
      })).body;

      console.log(trackData);

      tracks.push(trackData.items);
      
      offset += trackData.limit;

      if (trackData.offset + trackData.limit >= trackData.total)
      {
        return tracks;
      }
    }
  }
}

module.exports = (spotifyAPI) => new SpotifyLibraryService(spotifyAPI);

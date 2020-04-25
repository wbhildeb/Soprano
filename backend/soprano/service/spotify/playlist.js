
const PLAYLIST_FETCH_LIMIT = 50;
const TRACK_FETCH_LIMIT = 50;
const ADD_TRACK_LIMIT = 100;

class SpotifyPlaylistService
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
  async GetTrackIDs(playlistID)
  {
    var offset = 0;
    const trackIDs = [];

    while (true)
    {
      const playlistData = (await this.spotifyAPI.getPlaylistTracks(playlistID, {
        fields: 'items.track.id,limit,total,offset',
        offset,
        limit: TRACK_FETCH_LIMIT
      })).body;

      trackIDs.push(playlistData.items.map(item => item.track.id));
      
      offset += playlistData.limit;

      if (playlistData.offset + playlistData.limit >= playlistData.total)
      {
        return trackIDs;
      }
    }
  }

  /**
   * Get all of the playlist data
   */
  async GetPlaylists()
  {
    var offset = 0;
    const playlists = [];

    while (true)
    {
      const playlistData = (await this.spotifyAPI.getUserPlaylists({
        limit: PLAYLIST_FETCH_LIMIT,
        offset
      })).body;

      playlists.push(playlistData.items);
      offset += playlistData.limit;

      if (playlistData.offset + playlistData.limit >= playlistData.total)
      {
        return playlists;
      }
    }
  }

  /**
   * Add the given tracks to the given playlist
   * @param {string} playlistID
   * @param {string[]} tracks
   */
  async AddTracks(playlistID, tracks)
  {
    if (!tracks[0].startsWith('spotify:track:'))
    {
      tracks = tracks.map(trackid => 'spotify:track:' + trackid);
    }

    var offset = 0;
    const addPromises = [];

    while (offset < tracks.length)
    {
      addPromises.push(
        this.spotifyAPI.addTracksToPlaylist(playlistID, tracks.slice(offset, offset + ADD_TRACK_LIMIT))
      );
      offset += ADD_TRACK_LIMIT;
    }

    await Promise.all(addPromises);
  }

  /**
   * Add all the songs in source playlist to dest playlist
   * @param {string} source The id of the playlist that acts as a source of songs
   * @param {string} dest The id of the playlist which will have the songs added to it
   */
  async CopyTracks(source, dest)
  {
    const [sourceTracks, destTracks] = await Promise.all(this.GetTrackIDs(source), this.GetTrackIDs(dest));

    // Create a map for tracks in the destination playlist
    const inDest = destTracks.reduce(
      (map, item) => ({...map, [item]: true}),
      {}
    );

    // Filter out tracks that are already in the destination playlist
    const toAdd = sourceTracks.filter(track => !inDest[track]);
    await this.AddTracks(dest, toAdd);
  }
}

module.exports = (spotifyAPI) => new SpotifyPlaylistService(spotifyAPI);

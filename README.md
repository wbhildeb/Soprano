# My Spotify Site Project Experiment

## Idea
The plan for this project is to be able to make some playlists subsets of other playlists. For example if you had a _Classic Rock_ and a _All Rock_ playlists and wanted to make all of the songs you add to _Classic Rock_ also go into _All Rock_, you would set the _Classic Rock_ playlist to be a subset of the _All Rock_ playlist.

## Steps
### Database
We are going to need to store

- Session
  - sessionID
  - UserID
- User
  - UserID
  - Authentication Info (auth, refresh)
  - Playlist pairs (subset, superset)


### Spotify API Calls
- Authenticate?
- Refresh Authentication every 12 hours
  - If fails, delete session from database
- Get user info
- Add playlists to supersets
- Get playlist info

### 
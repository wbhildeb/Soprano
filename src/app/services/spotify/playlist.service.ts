import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService {

  constructor(private db: AngularFireDatabase) {}

    // Given a userID, return all the playlists' pairings the user has.
  GetUserPlaylists(userID: string)
  { // Replaces  GetPlaylistTrees()
    let userTree: any; // JSON tree representing the user playlists relationships. To be used for UI.
    this.db
            .list('/User_Playlists/' + userID + '/')
            .snapshotChanges()
            .map(changes => changes.map(c => ({id: c.payload.key, ...c.payload.toJSON()})))
            .subscribe(list =>
            {
              userTree = list;
              console.log('user tree: ', userTree);
            });
    return userTree;
  }

    // Given a userID and a playlistID, return all childrens' IDs
  GetSubPlaylistsByKey(userID: string, playlistkey: string): string[]
  {
    let subplaylists: string[];
    this.db
            .list('/User_Playlists/' + userID + '/playlists/' + playlistkey)
            .snapshotChanges()
            .map(changes => changes.map(c => (c.payload.key)))
            .subscribe((list: string[]) =>
            {
              subplaylists = list;
              console.log('subplaylists keys: ', subplaylists);
            });

    return subplaylists;
  }

        // Given a userID and a playlistID, return all parents' IDs
  GetParentPlaylistsByKey(userID: string, playlistkey: string): string[]
  {
    let parents: string[];
    this.db
            .list('/User_Playlists/' + userID + '/sub_playlists/' + playlistkey)
            .snapshotChanges()
            .map(changes => changes.map(c => (c.payload.key)))
            .subscribe((list: string[]) =>
            {
              parents = list;
              console.log('parents keys: ', parents);
            });

    return parents;
  }

  CreateSubPlaylist(userID: string, parent: Playlist, child: Playlist)
  {
        // Make API call to Spotify API, verify parent playlist exists
        // Make API call to Spotify API to check if child playlist exist (If not create one?)
        // Some circular dependancy check
    this.db
            .list('/User_Playlists/' + userID + '/playlists/')
            .update(parent.spotifyID, { [child.spotifyID]: true });

    this.db
            .list('/User_Playlists/' + userID + '/sub_playlists/')
            .update(child.spotifyID, { [parent.spotifyID]: true });
  }

  public GetUserPlaylistsFromSpotify()
  {
    throw new Error('PlaylistService:GetUserPlaylists() not implemented');
        // GetPlaylists from spotify: HttpRequest

  }

  private DeleteDeadPlaylistsInDB()
  {
  }
}

export class Playlist
{
  public name: string;
  public image;
  constructor(public spotifyID: string) { }
}



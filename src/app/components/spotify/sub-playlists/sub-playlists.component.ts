import { Component } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-sub-playlists',
  templateUrl: './sub-playlists.component.html',
  styleUrls: ['./sub-playlists.component.css'],
})

export class SubPlaylistsComponent {
  public playlistsQuery: AngularFireList<any>;  //Root of playlist tree
  public sub_playlistsQuery: AngularFireList<any>; //Root of sub-playlist tree
  public playlists: Playlist[]; //list of all playlists that have sub-children
  public sub_playlists: Playlist[]; //list of all playlists that have parents
  public selectedPlaylist: string; //For testing, to be removed. In reality we will fetch the playlistID from Spotify API

  constructor(private db: AngularFireDatabase) {
    this.playlistsQuery= db.list('/playlists');
    this.sub_playlistsQuery = this.db.list('/sub_playlists'); 

  //Get all parent playlists IDs
    this.playlistsQuery.snapshotChanges().pipe(map(changes => {
      return changes.map(c => ({ id: c.payload.key }));
    })).subscribe((list: Playlist[]) => {
      this.playlists = list;
      console.log("playlists: ", this.playlists);
    });

  //Get all sub_playlists IDs 
  this.sub_playlistsQuery.snapshotChanges().pipe(map(changes => {
    return changes.map(c => ({ id: c.payload.key}));
  })).subscribe((list: Playlist[]) => {
    this.sub_playlists = list;
    console.log("sub_playlists: ", this.sub_playlists);
  });   
}

  //Given a parent id, give me all sub-playlist IDs
  public GetSubPlaylistsByKey(playlistkey: string): string[]{
    var subplaylists: string[];
    this.db.list('/playlists/' + playlistkey).snapshotChanges().pipe(map(changes => {
      return changes.map(c => (c.payload.key));
    })).subscribe((list: string[]) => {
      subplaylists = list;
      console.log("subplaylists keys: ", subplaylists);
    });    
    return subplaylists;
  }

  //Given a sub-playlist id, give me all parent IDs
  public GetParentPlaylistsByKey(playlistkey:string): string[]{
    var parents: string[];
    this.db.list('/sub_playlists/' + playlistkey).snapshotChanges().pipe(map(changes => {
      return changes.map(c => (c.payload.key ));
    })).subscribe((list: string[]) => {
      parents = list;
      console.log("parents keys: ", parents);
    });    
    return parents;
  }
  
  public AddSubPlaylist(sub_playlist: string):void{
    //Make API call to Spotify to create new playlist if it does not exists, and fetch id.
    console.log("selected playlist:", this.selectedPlaylist, "sub_playlist:", sub_playlist);
    this.playlistsQuery.update(this.selectedPlaylist, {[sub_playlist]: true});
    this.sub_playlistsQuery.update(sub_playlist, {[this.selectedPlaylist]: true});
  }
}

class Playlist {
  constructor(public id) {}
}
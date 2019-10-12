import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators'

@Injectable({
    providedIn: 'root'
})

export class PlaylistService {

    constructor(private db: AngularFireDatabase) {}

    //Given a userID, return all the playlists' pairings the user has.
    GetUserPlaylists(userID: string) { //Replaces  GetPlaylistTrees()
        var userTree: any; //JSON tree representing the user playlists relationships. To be used for UI. 
        this.db.list('/User_Playlists/' + userID + '/').snapshotChanges().pipe(map(changes => {
            return changes.map(c => ({ id: c.payload.key, ...c.payload.toJSON() }))
        })).subscribe((list) => {
            userTree = list;
            console.log("user tree: ", userTree); //for testing 
        });
        return userTree;
    }
    
    //Given a userID and a playlistID, return all childrens' IDs
    GetSubPlaylistsByKey(userID: string, playlistkey: string): string[] {
        var subplaylists: string[];
        this.db.list("/User_Playlists/" + userID + '/playlists/' + playlistkey).snapshotChanges().pipe(map(changes => {
            return changes.map(c => (c.payload.key));
        })).subscribe((list: string[]) => {
            subplaylists = list;
            console.log("subplaylists keys: ", subplaylists);
        });
        return subplaylists;
     
        //Given a userID and a playlistID, return all parents' IDs 
    GetParentPlaylistsByKey(userID: string, playlistkey: string): string[] {
        var parents: string[];
        this.db.list("/User_Playlists/" + userID + '/sub_playlists/' + playlistkey).snapshotChanges().pipe(map(changes => {
            return changes.map(c => (c.payload.key));
        })).subscribe((list: string[]) => {
            parents = list;
            console.log("parents keys: ", parents);
        });
        return parents;
    }

    CreateSubPlaylist(userID: string, parent: Playlist, child: Playlist) { //Replaces PairPlaylists()
        //Make API call to Spotify API, verify parent playlist exists 
        //Make API call to Spotify API to check if child playlist exist (If not create one?)
        //Some circular dependancy check
        this.db.list("/User_Playlists/" + userID + '/playlists/').update(parent.spotifyID, { [child.spotifyID]: true });
        this.db.list("/User_Playlists/" + userID + '/sub_playlists/').update(child.spotifyID, { [parent.spotifyID]: true });
    }
      
    public GetUserPlaylistsFromSpotify()
    {
        throw 'PlaylistService:GetUserPlaylists() not implemented'
        // GetPlaylists from spotify: HttpRequest

    }

    private DeleteDeadPlaylistsInDB()
    {

    }

export class Playlist
{
    public spotifyID : string;
    public name: string;
    public image;

    constructor(public spotifyID) { }
}



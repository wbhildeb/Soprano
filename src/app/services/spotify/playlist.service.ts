import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { map } from 'rxjs/operators'
import { resolve, PromiseState } from 'q';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class PlaylistService {
    private parents: string[];
    private children: string[];
    private userTree: JSON[];

    constructor(private db: AngularFireDatabase) { }

    private updatePlaylists() {
        return this.parents;
    }

    //Given a userID, return all the playlists' pairings the user has.
    GetUserPlaylists(userID: string) { //Replaces  GetPlaylistTrees()
        return this.db.list('/User_Playlists/' + userID + '/').snapshotChanges().pipe(map(changes => {
            return changes.map(c => ({ id: c.payload.key, ...c.payload.toJSON() }))
        }));
    }

    //Given a userID and a playlistID, return all childrens' IDs
    public GetSubPlaylistsByKey(userID: string, playlistkey: string): Observable<string[]> {
        return this.db.list("/User_Playlists/" + userID + '/playlists/' + playlistkey).snapshotChanges().pipe(map(changes => {
            return changes.map(c => (c.payload.key));
        }));
    }

    //Given a userID and a playlistID, return all parents' IDs 
    public GetParentPlaylistsByKey(userID: string, playlistkey: string): Observable<string[]> {
        return this.db.list("/User_Playlists/" + userID + '/sub_playlists/' + playlistkey).snapshotChanges().pipe(map(changes => {
            return changes.map(c => (c.payload.key));
        }));
    }

    CreateSubPlaylist(userID: string, parent: Playlist, child: Playlist) { //Replaces PairPlaylists()
        //Make API call to Spotify API, verify parent playlist exists 
        //Make API call to Spotify API to check if child playlist exist (If not create one?)
        //Some circular dependancy check
        this.db.list("/User_Playlists/" + userID + '/playlists/').update(parent.spotifyID, { [child.spotifyID]: true });
        this.db.list("/User_Playlists/" + userID + '/sub_playlists/').update(child.spotifyID, { [parent.spotifyID]: true });
    }

    public GetUserPlaylistsFromSpotify() {
        throw 'PlaylistService:GetUserPlaylists() not implemented'
        // GetPlaylists from spotify: HttpRequest
    }

    private DeleteDeadPlaylistsInDB() {
    }
}

export class Playlist {
    public name: string;
    public image;
    constructor(public spotifyID: string) { }
}



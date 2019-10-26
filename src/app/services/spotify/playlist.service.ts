import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService
{
  constructor(
    private db: AngularFireDatabase,
    private userService: UserService,
    private http: HttpClient)
  { }

  /**
   * TODO: Comments
   * @returns TODO
   */
  public GetUserPlaylists(userID: string): Observable<Playlist[]>
  {
    return this.db
      .list(`/User_Playlists/${userID}/`)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => new Playlist(c.payload.key)))
      );
  }

  /**
   * TODO: Comments
   * @param key TODO: Make a description
   * @returns TODO: Make a description
   */
  public GetSubPlaylists(key: string): Observable<Playlist[]>
  {
    return this.userService
      .GetUserID()
      .pipe(
        switchMap(userID =>
          this.db
            .list(`/User_Playlists/${userID}/playlists/${key}`)
            .snapshotChanges()
            .pipe(
              map(changes => changes.map(c => new Playlist(c.payload.key)))
            ))
      );
  }

  /**
   * TODO
   * @param key TODO
   * @returns TODO
   */
  public GetParentPlaylists(key: string): Observable<Playlist[]>
  {
    return this.userService.GetUserID().pipe(
      switchMap(userID =>
        this.db
          .list(`/User_Playlists/${userID}/sub_playlists/${key}`)
          .snapshotChanges()
          .pipe(
            map(changes => changes.map(c => new Playlist(c.payload.key)))
          ))
    );
  }

  /**
   * Pair two playlists so that all songs in the child playlist
   *   (70s Rock, for example) will be added to the parent playlist
   *   (Rock, for example)
   * @param parent The playlist which will have songs added to it
   * @param child The playlist that will act as a source of songs for the parent
   */
  public CreateSubPlaylist(parent: Playlist, child: Playlist)
  {
    this.userService
      .GetUserID()
      .subscribe(id =>
      {
          // TODO: Circular dependency check

        this.db
            .list(`/User_Playlists/${id}/playlists/`)
            .update(parent.spotifyID, { [child.spotifyID]: true });

        this.db
            .list(`/User_Playlists/${id}/sub_playlists/`)
            .update(child.spotifyID, { [parent.spotifyID]: true });
      });
  }

  public GetUserPlaylistsFromSpotify(): Observable<Playlist[]>
  {
    console.log('playlist');
    return this
      .http
      .get<{id: string, name: string}[]>('http://localhost:3000/spotify/playlists', {
        withCredentials: true
      })
      .pipe(
        map(
          playlists => playlists.map(
            playlist =>
            {
              const p = new Playlist(playlist.id);
              p.name = playlist.name;
              return p;
            }))
      );
  }

  private DeleteDeadPlaylistsInDB() {}
}

export class Playlist {
  public name: string;
  public image;
  constructor(public spotifyID: string) { }
}



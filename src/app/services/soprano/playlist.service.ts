import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { UserPlaylists } from 'src/app/models/soprano/user-playlists.model';
import { PlaylistModel } from 'src/app/models/soprano/playlist.model';

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
   * @param key TODO: Make a description
   * @returns TODO: Make a description
   */
  public GetSubPlaylists(key: string): Observable<string[]>
  {
    return this.userService
      .GetUserID()
      .pipe(
        switchMap(userID =>
          this.db
            .list(`/User_Playlists/${userID}/playlists/${key}`)
            .snapshotChanges()
            .pipe(
              map(changes => changes.map(c => c.payload.key))
            ))
      );
  }

  /**
   * TODO
   * @param key TODO
   * @returns TODO
   */
  public GetParentPlaylists(key: string): Observable<string[]>
  {
    return this.userService.GetUserID().pipe(
      switchMap(userID =>
        this.db
          .list(`/User_Playlists/${userID}/sub_playlists/${key}`)
          .snapshotChanges()
          .pipe(
            map(changes => changes.map(c => c.payload.key))
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
  public CreateSubPlaylist(parent: PlaylistModel, child: PlaylistModel)
  {
    this.userService
      .GetUserID()
      .subscribe(id =>
      {
          // TODO: Circular dependency check

        this.db
            .list(`/User_Playlists/${id}/playlists/`)
            .update(parent.id, { [child.id]: true });

        this.db
            .list(`/User_Playlists/${id}/sub_playlists/`)
            .update(child.id, { [parent.id]: true });
      });
  }

  public GetSpotifyPlaylists(): Observable<PlaylistModel[]>
  {
    return this
      .http
      .get<any[]>('/api/soprano/playlists', {
        withCredentials: true
      })
      .pipe(
        map(
          playlists => playlists.map(
            playlist => (new PlaylistModel(playlist))
          ))
      );
  }

  public GetSubPlaylistRelations(): Observable<{playlists, sub_playlists}>
  {
    return this.userService
      .GetUserID()
      .pipe(
        switchMap((userID: string) =>
          this.db.database.ref(`/User_Playlists/${userID}/`).once('value')
        ),
        map(value => value.val())
            // .object<{playlists, sub_playlists}>(`/User_Playlists/${userID}/`)
            // .valueChanges()
      );
  }

  public GetSubPlaylistDatabase(): Observable<UserPlaylists>
  {
    return forkJoin(this.GetSpotifyPlaylists(), this.GetSubPlaylistRelations())
      .pipe<UserPlaylists>(
        map(
            ([spotify_playlists, {playlists}]) =>
          new UserPlaylists(spotify_playlists, playlists)
      ));
  }
}

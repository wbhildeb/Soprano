import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import { UserPlaylists } from 'src/app/models/soprano/user-playlists.model';
import { PlaylistModel } from 'src/app/models/soprano/playlist.model';
import { SopranoAPIService } from './sopranoAPI.service';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService
{
  constructor(private sopranoAPIService: SopranoAPIService) {}

  /**
   * @param parentPlaylistID id to get the children of
   * @returns an observable of an array of children of the parent playlist
   */
  public GetSubPlaylists(parentPlaylistID: string): Observable<string[]>
  {
    return this
      .sopranoAPIService
      .GetWithParams<Object>('/subplaylists/sub', {playlistID: parentPlaylistID})
      .pipe(map(data => Object.keys(data)));
  }

  /**
   * @param childPlaylistID id to get the parents of
   * @returns an observable of an array of parents of the child playlist
   */
  public GetParentPlaylists(childPlaylistID: string): Observable<string[]>
  {
    return this
      .sopranoAPIService
      .GetWithParams<Object>('/subplaylists/parent', {playlistID: childPlaylistID})
      .pipe(map(data => Object.keys(data)));
  }

  /**
   * Pair two playlists so that all songs in the child playlist
   *   (70s Rock, for example) will be added to the parent playlist
   *   (Rock, for example)
   * @param parent The playlist which will have songs added to it
   * @param child The playlist that will act as a source of songs for the parent
   */
  public PairPlaylists(parent: PlaylistModel, child: PlaylistModel)
  {
    this.sopranoAPIService
        .Post<Object>('/subplaylists/pair', {parentPlaylistID: parent.id, childPlaylistID: child.id});
  }

  /**
   * Pair two playlists so that all songs in the child playlist
   *   (70s Rock, for example) will be added to the parent playlist
   *   (Rock, for example)
   * @param parent The playlist which will have songs added to it
   * @param child The playlist that will act as a source of songs for the parent
   */
  public UnpairPlaylists(parent: PlaylistModel, child: PlaylistModel)
  {
    this.sopranoAPIService
        .Post<Object>('/subplaylists/unpair', {parentPlaylistID: parent.id, childPlaylistID: child.id});
  }

  /**
   * Get all playlists from Spotify for signed in user
   */
  public GetSpotifyPlaylists(): Observable<PlaylistModel[]>
  {
    return this
      .sopranoAPIService
      .Get<PlaylistModel[]>('/playlists/all')
      .pipe(
        map(res => res.body)
      );
  }

  /**
   * Get the playlists pairings from firebase DB
   */
  public GetSubPlaylistRelations(): Observable<{playlists, subplaylists}>
  {
    return this.sopranoAPIService
        .Get<{playlists, subplaylists}>('/subplaylists/relations')
        .pipe(
          map(res => res.body)
      );
  }

  /**
   * Build user playlists model using Spotify playlists and DB pairings
   */
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

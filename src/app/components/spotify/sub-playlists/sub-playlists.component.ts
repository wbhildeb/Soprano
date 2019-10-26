import { Component, OnInit } from '@angular/core';
import { Playlist, PlaylistService } from 'src/app/services/spotify/playlist.service';

@Component({
  selector: 'app-sub-playlists',
  templateUrl: './sub-playlists.component.html',
  styleUrls: ['./sub-playlists.component.css'],
})

export class SubPlaylistsComponent implements OnInit {
  public playlists: Playlist[];
  public selectedParent: Playlist;
  public selectedChild: Playlist;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit()
  {
    this.GetPlaylists();
  }

  private GetPlaylists()
  {
    this
    .playlistService
    .GetUserPlaylistsFromSpotify()
    .subscribe(
      (playlists: Playlist[]) => { this.playlists  = playlists; },
      console.error
    );
  }

  public PlaylistsSelected()
  {
    return this.selectedParent && this.selectedChild && this.selectedParent !== this.selectedChild;
  }

  public CreateSubPlaylist()
  {
    this
      .playlistService
      .CreateSubPlaylist(this.selectedParent, this.selectedChild);
  }
}

import { mockUserPlaylists } from './sub-playlists.mock-data';
import { UserPlaylists } from 'src/app/models/soprano/user-playlists.model';
import { Component, OnInit } from '@angular/core';
import { PlaylistService } from 'src/app/services/soprano/playlist.service';

@Component({
  selector: 'app-sub-playlists',
  templateUrl: './sub-playlists.component.html',
  styleUrls: ['./sub-playlists.component.scss'],
})

export class SubPlaylistsComponent implements OnInit {
  public playlistDB: UserPlaylists = mockUserPlaylists;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit()
  {
    this.playlistService.GetSubPlaylistDatabase().subscribe((db) =>
    {
      this.playlistDB = db;
    });
  }
}

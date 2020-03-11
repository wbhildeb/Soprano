import { UserPlaylists } from 'src/app/models/soprano/user-playlists.model';
import { Component, OnInit } from '@angular/core';
import { PlaylistModel } from 'src/app/models/soprano/playlist.model';
import { PlaylistService } from 'src/app/services/soprano/playlist.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { forkJoin, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-sub-playlists',
  templateUrl: './sub-playlists.component.html',
  styleUrls: ['./sub-playlists.component.scss'],
})

export class SubPlaylistsComponent implements OnInit {
  public playlistDB: UserPlaylists = null;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit()
  {
    // const apicall = this.playlistService.GetSpotifyPlaylists();
    // const dbcall = this.playlistService.GetSubPlaylistRelations();

    // forkJoin(
    //     apicall,
    //     // from([1,2,3]),
    //     dbcall
    //     // from([1,2,3])
    // ).subscribe(
    //     x => console.log('GOT:', x),
    //     err => console.log('Error:', err),
    //     () => console.log('Completed')
    // )

    this.playlistService.GetSubPlaylistDatabase().subscribe(pls => this.playlistDB = pls);
  }
}

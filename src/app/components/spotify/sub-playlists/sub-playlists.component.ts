import { Component, OnInit } from '@angular/core';
import { Playlist, PlaylistService, DynamicPlaylistNode, DynamicSubPlaylistDataSource } from 'src/app/services/spotify/playlist.service';
import { FlatTreeControl } from '@angular/cdk/tree';

@Component({
  selector: 'app-sub-playlists',
  templateUrl: './sub-playlists.component.html',
  styleUrls: ['./sub-playlists.component.scss'],
})

export class SubPlaylistsComponent implements OnInit {
  public playlists: Playlist[];
  public selectedParent: Playlist;
  public selectedChild: Playlist;

  public treeControl: FlatTreeControl<DynamicPlaylistNode>;
  public dataSource: DynamicSubPlaylistDataSource;

  constructor(private playlistService: PlaylistService) { }

  ngOnInit()
  {
    this.InitPlaylistTree();
    this.LoadPlaylistDB();
  }

  NodeHasChild = (_: number, _nodeData: DynamicPlaylistNode) => _nodeData.expandable;

  private InitPlaylistTree()
  {
    const getLevel = (node: DynamicPlaylistNode) => node.level;
    const isExpandable = (node: DynamicPlaylistNode) => node.expandable;

    this.treeControl = new FlatTreeControl<DynamicPlaylistNode>(getLevel, isExpandable);
  }

  private LoadPlaylistDB()
  {
    this.playlistService
      .GetSubPlaylistDatabase()
      .subscribe(
        db =>
        {
          this.dataSource = new DynamicSubPlaylistDataSource(this.treeControl, db);
          this.dataSource.data = db.TopLevelNodes();
        });
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

import { Component, OnInit, Input } from '@angular/core';
import { PlaylistModel } from 'src/app/models/soprano/playlist.model';

@Component({
  selector: 'app-grid-group',
  templateUrl: './grid-group.component.html',
  styleUrls: ['./grid-group.component.scss']
})
export class GridGroupComponent implements OnInit {
  @Input() public title: string;
  @Input() public subtext: string;
  @Input() public playlists: Array<PlaylistModel>;


  constructor() { }

  public ngOnInit()
  {
  }

}

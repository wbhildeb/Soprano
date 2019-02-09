import { Component, OnInit } from '@angular/core';

import { Track } from '../../spotify.models';

@Component({
  selector: 'app-track-list',
  templateUrl: './track-list.component.html',
  styleUrls: ['./track-list.component.css']
})
export class TrackListComponent implements OnInit {

  tracks: Track[] = [];

  constructor() { }

  ngOnInit() {
  }

}

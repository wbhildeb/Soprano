import { Component, OnInit } from '@angular/core';

import { Artist } from './spotify.models'

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.css']
})
export class SpotifyComponent implements OnInit {
  topArtists: Artist[];

  constructor() { }

  ngOnInit() {
    
  }

}

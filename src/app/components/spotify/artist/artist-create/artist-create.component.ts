import { Component, OnInit } from '@angular/core';

import { ArtistsService } from '../artists.service';

@Component({
    selector: 'app-artist-create',
    templateUrl: './artist-create.component.html',
    styleUrls: ['./artist-create.component.css']
})
export class ArtistCreateComponent implements OnInit {
    name: string = '';
    minutesListened: number;

    constructor(public artistsService: ArtistsService) { }

    ngOnInit()
    {
        
    }

    onAddArtist()
    {
        this.artistsService.addArtist(this.name, this.minutesListened);
        this.name = '';
        this.minutesListened = null;
    }
}

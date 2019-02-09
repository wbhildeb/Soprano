import { Component, OnInit } from '@angular/core';

import { ArtistsService } from '../../services/artists.service';

@Component({
    selector: 'app-artist-create',
    templateUrl: './artist-create.component.html',
    styleUrls: ['./artist-create.component.css']
})
export class ArtistCreateComponent implements OnInit {
    name: string;
    minutesListened: number;

    constructor(public artistsService: ArtistsService) { }

    ngOnInit()
    {
        this.resetForm()
    }

    onAddArtist()
    {
        if (!this.isArtistEntered()) return;

        this.artistsService.addArtist(this.name, this.minutesListened);
        this.resetForm();
    }

    isArtistEntered()
    {
        return this.name && this.minutesListened;
    }

    private resetForm()
    {
        this.name = null;
        this.minutesListened = null;
    }
}

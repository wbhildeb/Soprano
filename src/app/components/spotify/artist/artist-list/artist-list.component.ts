import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Artist } from '../artist.model';
import { ArtistsService } from '../artists.service';

@Component({
  selector: 'app-artist-list',
  templateUrl: './artist-list.component.html',
  styleUrls: ['./artist-list.component.css']
})
export class ArtistListComponent implements OnInit, OnDestroy {
    artists: Artist[] = [];
    private artistsSub: Subscription;

    constructor(public artistsService: ArtistsService) { }

    ngOnInit()
    {
        this.artistsService.getArtists();
        this.artistsSub = this.artistsService.getArtistUpdateListener()
            .subscribe((artists : Artist[]) =>
            {
                this.artists = artists;
            })
    }

    ngOnDestroy(): void {
        this.artistsSub.unsubscribe();
    }

}

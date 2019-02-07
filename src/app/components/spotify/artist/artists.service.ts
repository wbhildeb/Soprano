import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { Artist } from './artist.model';

@Injectable({providedIn: 'root'})
export class ArtistsService
{
    private artists: Artist[] = [];
    private artistsUpdated = new Subject<Artist[]>();

    constructor(private http: HttpClient){}

    getArtists()
    {
        this.http.get<{message: string, artists: Artist[]}>("http://localhost:3000/api/artists")
            .subscribe((artistData) =>
            {
                this.artists = artistData.artists;
                this.artistsUpdated.next([...this.artists]);
            })
    }

    getArtistUpdateListener() : Observable<Artist[]>
    {
        return this.artistsUpdated.asObservable();
    }
}
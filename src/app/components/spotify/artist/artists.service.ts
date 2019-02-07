import { Injectable } from '@angular/core';
import { Subject, Observable, empty } from 'rxjs';
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
        this.http.get<{message: string, artists: Artist[]}>('http://localhost:3000/api/artists')
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

    addArtist(name: string, minsListened: number)
    {
        const artist: Artist = {
            id: null,
            name: name,
            minutesListened: minsListened,
            topSongs: []
        };

        this.http.post<{message: string}>('http://localhost:3000/api/artists', artist)
            .subscribe((responseData) => 
            {
                console.log(responseData.message);
                this.artists.push(artist);
                this.artistsUpdated.next([...this.artists]);
            });
    }
}
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable, empty } from 'rxjs';
import { map } from 'rxjs/operators';

import { Artist } from './artist.model';

@Injectable({providedIn: 'root'})
export class ArtistsService
{
    private artists: Artist[] = [];
    private artistsUpdated = new Subject<Artist[]>();

    constructor(private http: HttpClient){}

    getArtists()
    {
        this.http
            .get<{message: string, artists: any}>(
                'http://localhost:3000/api/artists'
            )
            .pipe(map(artistData => 
            {
                return artistData.artists.map(artist => 
                {
                    return {
                        id: artist._id,
                        name: artist.name,
                        minutesListened: artist.minutesListened,
                        topSongs: artist.topSongs
                    }
                });
            }))
            .subscribe((artists) =>
            {
                this.artists = artists;
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
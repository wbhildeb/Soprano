import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators'

import { Track } from '../spotify.models';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { stringify } from 'querystring';

@Injectable({
    providedIn: 'root'
})
export class TracksService {

    private tracks: Track[];
    private tracksUpdated = new Subject<Track[]>();

    constructor(private http: HttpClient) { }

    getTopTracks()
    {
        this.http
        .get<{message: string, tracks: any}>('http://localhost:3000/api/spotify/tracks')
        .pipe(map((trackData) =>
        {
            return trackData.tracks.map(track =>
            {
                return {
                    id:                 track._id,
                    title:              track.title,
                    length:             track.length,
                    album:              track.album,
                    artists:            track.artists
                }
            });
        }))
        .subscribe((fixedTracks) =>
        {
            this.tracks = fixedTracks;
            this.tracksUpdated.next([...this.tracks]);
        });
    }
}

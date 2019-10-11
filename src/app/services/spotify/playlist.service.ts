import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService
{
    constructor() { }

    public GetUserPlaylists()
    {
        throw "PlaylistService:GetUserPlaylists() not implemented"
    }

    public PairPlaylists(parent : Playlist, child : Playlist)
    {
        // make sure they exits
        // deal with circular dependency case
        // pair them in the database
        // connect them in the database
    }
}

export class Playlist
{
    constructor() { }
}

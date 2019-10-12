import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService
{
    constructor() { }

    public GetUserPlaylistsFromSpotify()
    {
        throw 'PlaylistService:GetUserPlaylists() not implemented'
        // GetPlaylists from spotify: HttpRequest

    }

    private DeleteDeadPlaylistsInDB()
    {

    }

    public GetPlaylistTrees()
    {

    }

    /**
     * Create an entry in the database that pairs the two playlists
     * such that if you add a song to the child playlist, it adds the song
     * to the parent playlist.
     * 
     * @param parent This playlist will copy songs from 'child'
     * @param child This playlist will have its songs copied to 'parent'
     */
    public PairPlaylists(parent : Playlist, child : Playlist)
    {
        throw '';
        // make sure they exits
        // deal with circular dependency case
        // pair them in the database
    }
}

export class Playlist
{
    public spotifyID : string;
    public name: string;
    public image;

    constructor() { }
}

export interface Track
{
    id:                 string;
    title:              string;
    length:             number; // seconds
    album:              Album;
    artists:            Artist[];
}

export interface Album
{
    title:              string;
    imageSrc:           string;
    tracks:             Track[];
    artist:             Artist;
}

export interface Artist
{
    id:                 string;
    name:               string;
    minutesListened:    number;
    topSongs:           string[];
}
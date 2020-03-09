export class PlaylistModel
{
  public id: string;
  public name: string;
  public description: string;
  public url: string;
  public image: string;
  public collaborative: boolean;
  public numTracks: number;

  constructor (data: any)
  {
    this.name = data.name;
    this.description = data.description;
    this.collaborative = data.collaborative;
    this.numTracks = data.tracks.total;
    this.id = data.id;
    this.url = data.url;

    // Get the largest sized image
    this.image = !data.images.length ?
      undefined :
      data.images.reduce(function(prev, current)
      {
        return (prev.height > current.height) ? prev : current;
      }).url;
  }
}

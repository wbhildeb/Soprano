export class ExternalURLsModel
{
  public spotify: string;

  constructor({
    spotify = null
  }: {
    spotify: string
  })
  {
    this.spotify = spotify;
  }
}

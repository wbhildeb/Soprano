export class ImagesModel
{
  public height: number;
  public url: string;
  public width: number;

  constructor({
    height,
    url,
    width
  }: {
    height: number,
    url: string,
    width: number
  })
  {
    this.height = height;
    this.url = url;
    this.width = width;
  }
}

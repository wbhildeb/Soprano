export class FollowersModel
{
  public href: string;
  public total: number;

  constructor ({
    href = null,
    total
  }: {
    href: string,
    total: number
  })
  {
    this.href = href;
    this.total = total;
  }
}

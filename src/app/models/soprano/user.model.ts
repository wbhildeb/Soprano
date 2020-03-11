import { ImagesModel } from './images.model';
import { FollowersModel } from './followers.model';
import { ExternalURLsModel } from './external-urls.model';
export class UserModel
{
  public id: string;
  public name: string;
  public image: string;

  constructor ({
    country,
    display_name,
    email,
    external_urls,
    followers,
    href,
    id,
    images,
    product,
    type,
    uri
  }:
  {
    country?: string,
    display_name: string,
    email?: string,
    external_urls: ExternalURLsModel,
    followers: FollowersModel,
    href: string,
    id: string,
    images: [ImagesModel]
    product?: string,
    type: string,
    uri: string
  })
  {
    this.id = id;
    this.name = display_name;
    this.image = images.length ? images[0].url : null;
  }
}

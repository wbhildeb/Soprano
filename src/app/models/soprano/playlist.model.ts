import { UserModel } from './user.model';
import { ImagesModel } from './images.model';
import { ExternalURLsModel } from './external-urls.model';
export class PlaylistModel
{
  public id: string;
  public name: string;
  public description: string;
  public url: string;
  public image: string;
  public collaborative: boolean;
  public numTracks: number;

  constructor ({
    collaborative,
    description = null,
    external_urls,
    href,
    id,
    images,
    name,
    owner,
    // public = false,
    snapshot_id,
    tracks,
    type,
    uri
  }:
  {
    collaborative: boolean,
    description: string,
    external_urls: ExternalURLsModel,
    href: string,
    id: string,
    // images sorted in descending size
    images: [ImagesModel],
    name: string,
    owner: UserModel,
    // public: boolean,
    snapshot_id: string,
    tracks: {total: number}, // tracks: PagingModel,
    type: string,
    uri: string
  })
  {
    this.name = name;
    this.description = description;
    this.collaborative = collaborative;
    this.numTracks = tracks.total;
    this.id = id;
    this.url = external_urls.spotify;
    this.image = images[0].url;
  }
}

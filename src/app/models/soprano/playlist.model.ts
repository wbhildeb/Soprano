import { UserModel } from './user.model';
import { ImagesModel } from './images.model';
import { ExternalURLsModel } from './external-urls.model';
export class PlaylistModel
{
  public isCollaborative: boolean;
  public description: string;
  public id: string;
  public image: string;
  public name: string;
  public numTracks: number;
  public owner: UserModel;
  public url: string;

  public isWriteable: boolean;

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
    images: ImagesModel[],
    name: string,
    owner: UserModel,
    // public: boolean,
    snapshot_id: string,
    tracks: {total: number}, // tracks: PagingModel,
    type: string,
    uri: string
  })
  {
    this.isCollaborative = collaborative;
    this.description = description;
    this.id = id;
    this.image = images[0] ? images[0].url : '';
    this.name = name;
    this.numTracks = tracks.total;
    this.owner = owner;
    this.url = external_urls.spotify;
  }
}

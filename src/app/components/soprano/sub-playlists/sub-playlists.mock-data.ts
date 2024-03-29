import { ExternalURLsModel } from 'src/app/models/soprano/external-urls.model';
import { UserPlaylists } from 'src/app/models/soprano/user-playlists.model';
import { PlaylistModel } from 'src/app/models/soprano/playlist.model';
import { ImagesModel } from 'src/app/models/soprano/images.model';
import { UserModel } from 'src/app/models/soprano/user.model';

/* tslint:disable:max-line-length */
const images_cloud = [new ImagesModel({height: 256, width: 256, url: 'https://res-4.cloudinary.com/crunchbase-production/image/upload/c_thumb,h_256,w_256,f_auto,g_faces,z_0.7,q_auto:eco/v1441276345/rrwykvveztjg4bhdngyq.png'})];
const images_fox = [new ImagesModel({height: 256, width: 256, url: 'https://images.squarespace-cdn.com/content/v1/5b04ba4e2714e57af9b2b218/1545014396159-ZUEVAGP6JLGYW2JDNUNE/ke17ZwdGBToddI8pDm48kHhlTY0to_qtyxq77jLiHTtZw-zPPgdn4jUwVcJE1ZvWhcwhEtWJXoshNdA9f1qD7Xj1nVWs2aaTtWBneO2WM-sIRozzR0FWTsIsFVspibqsB7eL2qd43SOgdOvkAOY75w/Small+Fox.jpg'})];
const images_dk = [new ImagesModel({height: 256, width: 256, url: 'https://d2skuhm0vrry40.cloudfront.net/2018/articles/2018-06-13-16-31/NintendoSwitch_SuperSmashBrosUltimate_CharacterArt_02.jpg/EG11/resize/256x-1/quality/65/format/jpg'})];
const images_corrin = [new ImagesModel({height: 256, width: 256, url: 'https://d2skuhm0vrry40.cloudfront.net/2018/articles/2018-06-13-16-31/NintendoSwitch_SuperSmashBrosUltimate_CharacterArt_66.jpg/EG11/resize/256x-1/quality/65/format/jpg'})];
const images_falco = [new ImagesModel({height: 256, width: 256, url: 'https://d2skuhm0vrry40.cloudfront.net/2018/articles/2018-06-13-16-31/falco.jpg/EG11/resize/256x-1/quality/65/format/jpg'})];
const images_cfalcon = [new ImagesModel({height: 256, width: 256, url: 'https://static.myfigurecollection.net/pics/figure/big/254887.jpg'})];
const images_kirby = [new ImagesModel({height: 256, width: 256, url: 'https://pbs.twimg.com/profile_images/378800000120793506/e8d4e265f20c6a2ee34a704f06aeb09a.png'})];
/* tslint:enable:max-line-length */


const default_user = new UserModel({
  display_name: 'Terrance Frogmate',
  external_urls: null,
  followers: null,
  href: '',
  id: 'terry',
  images: [{height: 1365, width: 2048, url: 'https://static01.nyt.com/images/2019/04/02/science/28SCI-ZIMMER1/28SCI-ZIMMER1-superJumbo.jpg'}],
  type: 'user',
  uri: 'spotify:funkvolume'
});

const default_playlist = {
  collaborative: false,
  description: 'this is a description',
  external_urls: new ExternalURLsModel({spotify: 'www.spotify.com'}),
  href: 'www.dddd.com',
  id: 'id0',
  images: [],
  name: 'Lil\' Mac',
  owner: default_user,
  public: true,
  snapshot_id: 'asdjlaskdjlasd',
  tracks: {total: 50}, // tracks: PagingModel,
  type: 'playlist',
  uri: 'spotify:funkurself'
};

const playlists: PlaylistModel[] = [
  new PlaylistModel(Object.assign(default_playlist, {id: 'id1', name: 'Cloud', images: images_cloud})),
  new PlaylistModel(Object.assign(default_playlist, {id: 'id2', name: 'Fox', images: images_fox})),
  new PlaylistModel(Object.assign(default_playlist, {id: 'id3', name: 'Donky Kong', images: images_dk})),
  new PlaylistModel(Object.assign(default_playlist, {id: 'id4', name: 'Corrin', images: images_corrin})),
  new PlaylistModel(Object.assign(default_playlist, {id: 'id5', name: 'Falco', images: images_falco})),
  new PlaylistModel(Object.assign(default_playlist, {id: 'id6', name: 'Captain Falcon', images: images_cfalcon})),
  new PlaylistModel(Object.assign(default_playlist, {id: 'id7', name: 'Kirby', images: images_kirby})),
];

const relations = {
  id1: {
    id2: true,
    id3: true
  },
  id3: {
    id4: true,
    id5: true
  }
};

export let mockUserPlaylists: UserPlaylists = new UserPlaylists(default_user, playlists, relations);


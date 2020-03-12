import { PlaylistModel } from 'src/app/models/soprano/playlist.model';

export class UserPlaylists {
  private playlists: Map<string, PlaylistModel>;
  private childToParents: Map<PlaylistModel, PlaylistModel[]>;
  private parentToChildren: Map<PlaylistModel, PlaylistModel[]>;

  /**
   *
   * @param playlists all the playlists from spotify
   * @param relations keys are parents, objects have keys which are children
   */
  constructor(playlists: PlaylistModel[], relations: {})
  {
    this.playlists = new Map<string, PlaylistModel>();
    this.childToParents = new Map<PlaylistModel, PlaylistModel[]>();
    this.parentToChildren = new Map<PlaylistModel, PlaylistModel[]>();

    // Set all the pl
    playlists.forEach(pl =>
    {
      this.playlists.set(pl.id, pl);
    });

    Object.keys(relations).forEach(parentID =>
    {
      // Parent playlist has been removed from spotify
      if (!this.playlists.has(parentID)) { return; }
      const parentPL = this.playlists.get(parentID);

      Object.keys(relations[parentID]).forEach(childID =>
      {
        // Child playlist has been removed from spotify
        if (!this.playlists.has(childID)) { return; }

        const childPL = this.playlists.get(childID);

        if (this.parentToChildren.has(parentPL))
        {
          this.parentToChildren.get(parentPL).push(childPL);
        }
        else
        {
          this.parentToChildren.set(parentPL, [childPL]);
        }

        if (this.childToParents.has(childPL))
        {
          this.childToParents.get(childPL).push(parentPL);
        }
        else
        {
          this.childToParents.set(childPL, [parentPL]);
        }
      });
    });
  }

  public GetAllPlaylists(): PlaylistModel[]
  {
    return Array.from(this.playlists.values());
  }

  public GetAllParents(): PlaylistModel[]
  {
    return Array.from(this.parentToChildren.keys());
  }

  public GetChildrenOf(parent: PlaylistModel): PlaylistModel[]
  {
    return this.parentToChildren.get(parent);
  }

  public GetParentsOf(child: PlaylistModel): PlaylistModel[]
  {
    return this.childToParents.get(child);
  }
}

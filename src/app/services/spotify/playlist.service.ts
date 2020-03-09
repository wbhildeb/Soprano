import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, switchMap } from 'rxjs/operators';
import { Observable, forkJoin, BehaviorSubject, merge } from 'rxjs';
import { UserService } from './user.service';
import { HttpClient } from '@angular/common/http';
import { CollectionViewer, SelectionChange } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { PlaylistModel } from 'src/app/models/soprano/playlist.model';

@Injectable({
  providedIn: 'root'
})

export class PlaylistService
{
  constructor(
    private db: AngularFireDatabase,
    private userService: UserService,
    private http: HttpClient)
  { }

  /**
   * TODO: Comments
   * @returns TODO
   */
  public GetUserPlaylists(userID: string): Observable<PlaylistModel[]>
  {
    return this.db
      .list(`/User_Playlists/${userID}/`)
      .snapshotChanges()
      .pipe(
        map(changes => changes.map(c => new PlaylistModel(c.payload.key)))
      );
  }

  /**
   * TODO: Comments
   * @param key TODO: Make a description
   * @returns TODO: Make a description
   */
  public GetSubPlaylists(key: string): Observable<PlaylistModel[]>
  {
    return this.userService
      .GetUserID()
      .pipe(
        switchMap(userID =>
          this.db
            .list(`/User_Playlists/${userID}/playlists/${key}`)
            .snapshotChanges()
            .pipe(
              map(changes => changes.map(c => new PlaylistModel({id: c.payload.key})))
            ))
      );
  }

  /**
   * TODO
   * @param key TODO
   * @returns TODO
   */
  public GetParentPlaylists(key: string): Observable<PlaylistModel[]>
  {
    return this.userService.GetUserID().pipe(
      switchMap(userID =>
        this.db
          .list(`/User_Playlists/${userID}/sub_playlists/${key}`)
          .snapshotChanges()
          .pipe(
            map(changes => changes.map(c => new PlaylistModel({ id: c.payload.key })))
          ))
    );
  }

  /**
   * Pair two playlists so that all songs in the child playlist
   *   (70s Rock, for example) will be added to the parent playlist
   *   (Rock, for example)
   * @param parent The playlist which will have songs added to it
   * @param child The playlist that will act as a source of songs for the parent
   */
  public CreateSubPlaylist(parent: PlaylistModel, child: PlaylistModel)
  {
    this.userService
      .GetUserID()
      .subscribe(id =>
      {
          // TODO: Circular dependency check

        this.db
            .list(`/User_Playlists/${id}/playlists/`)
            .update(parent.id, { [child.id]: true });

        this.db
            .list(`/User_Playlists/${id}/sub_playlists/`)
            .update(child.id, { [parent.id]: true });
      });
  }

  public GetUserPlaylistsFromSpotify(): Observable<PlaylistModel[]>
  {
    return this
      .http
      .get<{id: string, name: string}[]>('/api/soprano/playlists', {
        withCredentials: true
      })
      .pipe(
        map(
          playlists => playlists.map(
            playlist => (new PlaylistModel(playlist))
          ))
      );
  }

  public GetSubPlaylistRelations(): Observable<{parentsOf: Map<string, string[]>, childrenOf: Map<string, string[]>}>
  {
    return this.userService
      .GetUserID()
      .pipe(
        switchMap((userID: string) =>
        {
          return this.db.database.ref(`/User_Playlists/${userID}/`).once('value');
        }),
        map((value) =>
        {
          const parentsOf  = new Map<string, string[]>();
          const childrenOf = new Map<string, string[]>();

          const { playlists, sub_playlists } = value.val();

          Object
            .keys(sub_playlists)
            .forEach(key =>
            {
              parentsOf.set(key, Object.keys(sub_playlists[key]));
            });

          Object
            .keys(playlists)
            .forEach(key =>
            {
              childrenOf.set(key, Object.keys(playlists[key]));
            });

          return { parentsOf, childrenOf };
        })
      );
  }

  public GetSubPlaylistDatabase() // : Observable<SubPlaylistDatabase>
  {
    const getPlaylists: Observable<Map<string, PlaylistModel>> =
      this.GetUserPlaylistsFromSpotify().pipe(map(
        (playlists: PlaylistModel[]) =>
        {
          const IDtoPlaylist = new Map<string, PlaylistModel>();
          playlists.forEach(playlist => IDtoPlaylist.set(playlist.id, playlist));
          return IDtoPlaylist;
        }
    ));

    const getRelations = this.GetSubPlaylistRelations();


    return forkJoin(getPlaylists, getRelations)
      .pipe(
        map(([IDtoPlaylist, {parentsOf, childrenOf}]) =>
        {
          const parentsOfPL = new Map<PlaylistModel, PlaylistModel[]>();
          const childrenOfPL = new Map<PlaylistModel, PlaylistModel[]>();

          parentsOf.forEach((parentIDs, childID) =>
          {
            parentsOfPL.set(IDtoPlaylist.get(childID), parentIDs.map(id => IDtoPlaylist.get(id)));
          });

          childrenOf.forEach((childIDs, parentID) =>
          {
            childrenOfPL.set(IDtoPlaylist.get(parentID), childIDs.map(id => IDtoPlaylist.get(id)));
          });

          return new SubPlaylistDatabase(childrenOfPL, parentsOfPL);
        })
      );
  }
}

export class DynamicPlaylistNode {
  constructor(
    public item: PlaylistModel,
    public level: number,
    public expandable = false,
    public isLoading = false
  ) {}
}

export class SubPlaylistDatabase
{
  /**
   *
   * @param childrenOf key: parent playlist, value: the key's children
   * @param parentsOf key: child playlist,   value: the keys' parents
   */
  constructor(
    /*private*/ public childrenOf: Map<PlaylistModel, PlaylistModel[]>,
    private parentsOf: Map<PlaylistModel, PlaylistModel[]>
  )
  {}

  /**
   * @returns The playlist nodes which have children and no parents
   */
  public TopLevelNodes(): DynamicPlaylistNode[]
  {
    const nodes: DynamicPlaylistNode[] = [];

    this.childrenOf.forEach(
      (children, parent) =>
      {
        if (!this.HasParent(parent))
        {
          nodes.push(new DynamicPlaylistNode(parent, 0, true));
        }
      }
    );

    return nodes;
  }

  /**
   * @returns Whether or not any playlists give songs to the provided playlist
   */
  public HasChild(playlist: PlaylistModel): boolean
  {
    return this.childrenOf.has(playlist);
  }

  /**
   * @returns the playlist which will provide songs for the given playlist
   */
  public GetChildren(playlist: PlaylistModel): PlaylistModel[]
  {
    return this.childrenOf.get(playlist) || [];
  }

  /**
   * @returns true if the provided playlists is a source of songs for another playlist
   */
  public HasParent(playlist: PlaylistModel): boolean
  {
    return this.parentsOf.has(playlist);
  }
}


@Injectable()
export class DynamicSubPlaylistDataSource {

  dataChange = new BehaviorSubject<DynamicPlaylistNode[]>([]);

  get data(): DynamicPlaylistNode[] { return this.dataChange.value; }
  set data(value: DynamicPlaylistNode[])
  {
    this._treeControl.dataNodes = value;
    this.dataChange.next(value);
  }

  constructor(private _treeControl: FlatTreeControl<DynamicPlaylistNode>,
              private _database: SubPlaylistDatabase) {}

  connect(collectionViewer: CollectionViewer): Observable<DynamicPlaylistNode[]>
  {
    this._treeControl.expansionModel.changed.subscribe(change =>
    {
      if ((change as SelectionChange<DynamicPlaylistNode>).added ||
        (change as SelectionChange<DynamicPlaylistNode>).removed)
      {
        this.handleTreeControl(change as SelectionChange<DynamicPlaylistNode>);
      }
    });

    return merge(collectionViewer.viewChange, this.dataChange).pipe(map(() => this.data));
  }

  /** Handle expand/collapse behaviors */
  handleTreeControl(change: SelectionChange<DynamicPlaylistNode>)
  {
    if (change.added)
    {
      change.added.forEach(node => this.toggleNode(node, true));
    }
    if (change.removed)
    {
      change.removed.slice().reverse().forEach(node => this.toggleNode(node, false));
    }
  }

  /**
   * Toggle the node, remove from display list
   */
  toggleNode(node: DynamicPlaylistNode, expand: boolean)
  {
    const children = this._database.GetChildren(node.item);
    const index = this.data.indexOf(node);
    if (!children || index < 0)
    { // If no children, or cannot find the node, no op
      return;
    }

    node.isLoading = true;

    setTimeout(() =>
    {
      if (expand)
      {
        const nodes = children.map(playlist =>
          new DynamicPlaylistNode(playlist, node.level + 1, this._database.HasChild(playlist)));
        this.data.splice(index + 1, 0, ...nodes);
      }
      else
      {
        let count = 0;
        for (let i = index + 1; i < this.data.length
          && this.data[i].level > node.level; i++, count++) {}
        this.data.splice(index + 1, count);
      }

      // notify the change
      this.dataChange.next(this.data);
      node.isLoading = false;
    }, 500);
  }
}

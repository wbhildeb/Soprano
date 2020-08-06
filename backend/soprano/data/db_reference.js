
class DatabaseReference
{
  constructor(root)
  {
    this.root = root;
  }

  UserMetadata()
  {
    return this.root.child('UserMetadata');
  }

  Sessions()
  {
    return this.root.child('Sessions');
  }

  SubPlaylists()
  {
    return this.root.child('SubPlaylists');
  }

  UserSubPlaylists(userID)
  {
    return this.SubPlaylists().child(userID).child('subPlaylists');
  }

  UserParentPlaylists(userID)
  {
    return this.SubPlaylists().child(userID).child('playlists');
  }

  User(userID)
  {
    return this.UserMetadata().child(userID);
  }

  Session(sessionID)
  {
    return this.Sessions().child(sessionID);
  }

  UserSessions(userID)
  {
    return this.User(userID).child('sessions');
  }

  UserSession(userID, sessionID)
  {
    return this.UserSessions(userID).child(sessionID);
  }

  UserCredentials(userID)
  {
    return this.User(userID).child('credentials');
  }
}

/**
 * @returns {dbRef}
 */
module.exports = (database) => new DatabaseReference(database);


class DatabaseReference
{
  constructor(database)
  {
    this.database = database;
  }

  UserMetadata()
  {
    return this.database.ref('UserMetadata');
  }

  Sessions()
  {
    return this.database.ref('Sessions');
  }

  SubPlaylists()
  {
    return this.database.ref('SubPlaylists');
  }

  UserSubPlaylists(userID)
  {
    return this.SubPlaylists.child(userID).ref('subPlaylists');
  }

  UserParentPlaylists(userID)
  {
    return this.SubPlaylists.child(userID).ref('playlists');
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

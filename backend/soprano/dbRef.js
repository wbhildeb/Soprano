class dbRef
{
  constructor(database)
  {
    this.database = database;
  }

  metadataRef()
  {
    return this.database.ref('User_Metadata');
  }

  sessionsRef()
  {
    return this.database.ref('Sessions');
  }

  playlistsRef()
  {
    return this.database.ref('User_Playlists');
  }

  user(userID)
  {
    return this.metadataRef().child(`${userID}`);
  }

  session(sessionID)
  {
    return this.sessionsRef().child(`${sessionID}`);
  }

  userSession(userID, sessionID)
  {
    return this.metadataRef().child(`${userID}/Sessions/${sessionID}`);
  }

  userSessions(userID)
  {
    return this.metadataRef().child(`${userID}/Sessions/`);
  }

  userCredentials(userID)
  {
    return this.metadataRef().child(`${userID}/credentials/`);
  }
}

/**
 * @returns {dbRef}
 */
module.exports = (database) => new dbRef(database);
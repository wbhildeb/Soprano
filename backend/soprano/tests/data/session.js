const expect = require('chai').expect;
const database = require('../firebase_emulator/database');
const db = require('../../data/db_reference')(database);
const SessionInterface = require('../../data/interface/session')(database);


const users = {
  new: {
    id: 'JJameson', session: 'kjasgd34'
  },
  single_session: {
    id: 'SRobins', session: 'jjjjklj'
  },
  multi_session: {
    id: 'CCombs', session: 'asssddd'
  }
};

describe('Save()', () =>
{
  before(async () =>
  {
    await database.load(require('../firebase_emulator/mock_data/session_data.json'));
  });

  it('should save session for new user', async () =>
  {
    await SessionInterface.Save(users.new.session, users.new.id);
    const sessions = await db.UserSessions(users.new.id).once('value');
    expect(sessions.val()).to.deep.equal({[users.new.session]: true });
  });
  
  it('should add to single-session user', async () =>
  {
    await SessionInterface.Save(users.single_session.session, users.single_session.id);
    const sessions = await db.UserSessions(users.single_session.id).once('value');

    const sessionIDs = Object.keys(sessions.val());
    
    expect(sessionIDs).to.have.lengthOf(2);
    expect(sessionIDs).to.contain(users.single_session.session);
  });
  
  it('should add to multi-session user', async () =>
  {
    var sessions = await db.UserSessions(users.multi_session.id).once('value');
    const ogNumSessions = Object.keys(sessions.val()).length;

    await SessionInterface.Save(users.multi_session.session, users.multi_session.id);
    sessions = await db.UserSessions(users.multi_session.id).once('value');
    const sessionIDs = Object.keys(sessions.val());

    expect(sessionIDs).to.have.lengthOf(ogNumSessions + 1);
    expect(sessionIDs).to.contain(users.multi_session.session);
  });

  it('should disconnect other users from session id', async() =>
  {
    
  });

  it('should change nothing if the session already exists', async() =>
  {

  });
});

describe('GetUserID()', () =>
{
  before(async () =>
  {
    await database.load(require('../firebase_emulator/mock_data/session_data.json'));
  });

  it('should work for single-session user', async () =>
  {
    const userID = await SessionInterface.GetUserID('dodXO0RS');
    expect(userID).to.equal('NSpooner');
  });

  it('should work for multi-session user', async () =>
  {
    const userID = await SessionInterface.GetUserID('H8jYFxyr');
    expect(userID).to.equal('CCombs');
  });

  it('should return null on non-existant session', async () =>
  {
    const fakeSessionID = 'i dont exist';
    const userID = await SessionInterface.GetUserID(fakeSessionID);
    expect(userID).to.be.null;
  });
});

describe('DeleteAll()', () =>
{
  before(async () =>
  {
    await database.load(require('../firebase_emulator/mock_data/session_data.json'));
  });

  it('should delete everything', async () =>
  {
    await SessionInterface.DeleteAll();
    const data = await database.ref().once('value');
    expect(data.exists()).is.false;
  });
});

describe('DeleteForUser()', () =>
{
  const deleteForUser = async (userID, sessionIDs) =>
  {
    const userExists = { pre: null, post: null};
    const sessionsExist = [];

    userExists.pre = (await db.User(userID).once('value')).exists();
    sessionIDs.forEach(async id =>
    {
      sessionsExist.push({ pre: (await db.Session(id).once('value')).exists()});
    });

    await SessionInterface.DeleteForUser(userID);

    sessionIDs.forEach(async (id, i)=>
    {
      sessionsExist[i].post = (await db.Session(id).once('value')).exists();
    });

    userExists.post = (await db.User(userID).once('value')).exists();
    return { userExists, sessionsExist };
  };

  var results;
  before(async () =>
  {
    await database.load(require('../firebase_emulator/mock_data/session_data.json'));
    results =
    {
      single_session: await deleteForUser('MKeith', ['k6wv7Ect']),
      multi_session: await deleteForUser('HSpence', ['sp3xlFWN', 'nI1mQ4P6']),
      non_existant: await deleteForUser('fake username', ['not a session', 'also not a session'])
    };
  });

  it('should delete single-session users', () =>
  {
    const userExists = results.single_session.userExists;
    expect(userExists.pre).to.be.true;
    expect(userExists.post).to.be.false;
  });

  it('should delete a single session', () =>
  {
    const {pre, post} = results.single_session.sessionsExist[0];
    expect(pre).to.be.true;
    expect(post).to.be.false;
  });

  it('should delete a multi-session user', () =>
  {
    const userExists = results.multi_session.userExists;
    expect(userExists.pre).to.be.true;
    expect(userExists.post).to.be.false;
  });

  it('should delete multiple sessions', () =>
  {
    const sessionsExist = results.single_session.sessionsExist;
    sessionsExist.forEach(({pre, post}) =>
    {
      expect(pre).to.be.true;
      expect(post).to.be.false;
    });
  });

  it('should work for non-existant user', async () =>
  {
    const sessionsExist = results.non_existant.sessionsExist;
    sessionsExist.forEach(({pre, post}) =>
    {
      expect(pre).to.be.false;
      expect(post).to.be.false;
    });
  });
});

describe('Delete()', () =>
{
  before(async () =>
  {
    await database.load(require('../firebase_emulator/mock_data/session_data.json'));
  });

  it('should delete a single session entry', async() =>
  {
    const sessionID = 'uidEVRp7';
    //const userID = 'SRobins';

    var sessions_pre = Object.keys((await db.Sessions().once('value')).val());
    await SessionInterface.Delete(sessionID);
    const sessions_post = Object.keys((await db.Sessions().once('value')).val());

    expect(sessions_pre).contains(sessionID);
    sessions_pre = sessions_pre.filter(id => id !== sessionID);

    expect(sessions_post).deep.equals(sessions_pre);
  });

  it('should remove a single-session user', async () =>
  {
    const sessionID = 'J2Ebxcif';
    const userID = 'LFountain';

    const userExists_pre = (await db.User(userID).once('value')).exists();
    await SessionInterface.Delete(sessionID);
    const userExists_post = (await db.User(userID).once('value')).exists();

    expect(userExists_pre).to.be.true;
    expect(userExists_post).to.be.false;
  });

  it('should remove a session from multi-session user', async () =>
  {
    const sessionID = 'nI1mQ4P6';
    const userID = 'HSpence';

    var sessions_pre = Object.keys((await db.UserSessions(userID).once('value')).val());
    await SessionInterface.Delete(sessionID);
    const sessions_post = Object.keys((await db.UserSessions(userID).once('value')).val());

    expect(sessions_pre).contains(sessionID);
    sessions_pre = sessions_pre.filter(id => id !== sessionID);
    expect(sessions_post).deep.equals(sessions_pre);
  });

  it('should not throw error if session does not exist', async () =>
  {
    const sessionID = 'I do not exist';
    expect(SessionInterface.Delete(sessionID)).to.not.throw();
  });
});
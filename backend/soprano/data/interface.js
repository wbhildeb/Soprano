const firebase = require('firebase');
const env = require('../environment');
const DatabaseEmulatorInterface = require('./emulator_interface');

const dbRoot = env.emulateDatabase ?
  DatabaseEmulatorInterface.UserDataRoot() :
  firebase.initializeApp(env.firebase.info.client, 'soprano').database().ref();

const SessionDataInterface = require('./interface/session')(dbRoot);
const UserDataInterface = require('./interface/user')(dbRoot);
const SubPlaylistDataInterface = require('./interface/sub_playlist')(dbRoot);

module.exports = {
  SessionDataInterface,
  UserDataInterface,
  SubPlaylistDataInterface,
};

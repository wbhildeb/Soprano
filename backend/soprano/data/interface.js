const firebase = require('firebase');
const env = require('../environment');

const database = firebase.initializeApp(env.firebase, 'soprano_prod').database();

const SessionDataInterface = require('./interfaces/session')(database);
const UserDataInterface = require('./interfaces/user')(database);
const SubPlaylistDataInterface = require('./interfaces/sub_playlist')(database);

module.exports = {
  SessionDataInterface,
  UserDataInterface,
  SubPlaylistDataInterface
};

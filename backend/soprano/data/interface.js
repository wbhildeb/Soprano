const firebase = require('firebase');
const env = require('../environment');

firebase.initializeApp(env.firebase);
const database = firebase.database();

const SessionDataInterface = require('./interfaces/session')(database);
const UserDataInterface = require('./interfaces/user')(database);
const SubPlaylistDataInterface = require('./interfaces/subplaylist')(database);

module.exports = {
  SessionDataInterface,
  UserDataInterface,
  SubPlaylistDataInterface
};

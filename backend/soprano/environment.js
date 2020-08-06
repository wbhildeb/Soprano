
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

const emulateSpotify = process.env.EMULATE_SPOTIFY === 'TRUE'  ||  (process.env.EMULATE_SPOTIFY !== 'FALSE' && !isProduction);
const emulateDatabase = process.env.EMULATE_DB === 'TRUE'  ||  (process.env.EMULATE_DB !== 'FALSE' && !isProduction);

const firebase = require('./config/firebase.json');
const spotify = require('./config/spotify.json');

module.exports = {
  isProduction,
  isDevelopment,
  isTest,
  spotify,
  firebase,
  emulateSpotify,
  emulateDatabase
};
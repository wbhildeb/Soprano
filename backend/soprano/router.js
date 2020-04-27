const express = require('express');

const auth = require('./middleware/auth');
const user = require('./middleware/user');
const playlists = require('./middleware/playlists');
const subplaylists = require('./middleware/sub_playlist');

const isLoggedIn = require('./middleware/validator/is_logged_in');

const router = express.Router();

module.exports = router
  .use('/auth', auth)
  .use('*', isLoggedIn)
  .use('/user', user)
  .use('/playlists', playlists)
  .use('/subplaylists', subplaylists);
const express = require('express');
const ash = require('express-async-handler');
const PlaylistService = require('../service/playlist');

const router = express.Router();

router.get('/all', ash(async (req, res) =>
{
  const playlists = await PlaylistService.GetAll(req.userID);
  res.status(200).json(playlists);
}));

module.exports = router;

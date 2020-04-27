const express = require('express');
const ash = require('express-async-handler');
const SubPlaylistService = require('../service/sub_playlist');

const router = express.Router();

router.get('/parent', ash(async (req, res) => 
{
  const playlists = await SubPlaylistService.GetParentPlaylists(req.userID, req.body.playlistID);
  res.status(200).json(playlists);
}));

router.get('/sub', ash(async (req, res) => 
{
  const playlists = await SubPlaylistService.GetSubPlaylists(req.userID, req.body.playlistID);
  res.status(200).json(playlists);
}));

router.post('/pair', ash(async (req, res) => 
{
  await SubPlaylistService.PairPlaylists(req.userID, req.body.parentPlaylistID, req.body.childPlaylistID);
  res.status(200).end();
}));

router.post('/unpair', ash(async (req, res) => 
{
  await SubPlaylistService.UnpairPlaylists(req.userID, req.body.parentPlaylistID, req.body.childPlaylistID);
  res.status(200).end();
}));

router.get('/relations', ash(async (req, res) => 
{
  const relations = await SubPlaylistService.GetSubPlaylistRelations(req.userID);
  res.status(200).json(relations);
}));

module.exports = router;

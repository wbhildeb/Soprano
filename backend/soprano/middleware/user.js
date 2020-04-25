const express = require('express');
const ash = require('express-async-handler');
const UserService = require('../service/user');

const router = express.Router();

router.get('/id', ash(async (req, res) =>
{
  const id = await UserService.GetID(req.sessionID);
  res.status(200).json(id);
}));

router.get('/details', ash(async (req, res) =>
{
  const userDetails = await UserService.GetDetails(req.sessionID);
  res.status(200).json(userDetails);
}));

module.exports = router;

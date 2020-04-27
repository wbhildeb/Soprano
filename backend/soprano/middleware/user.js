const express = require('express');
const ash = require('express-async-handler');
const UserService = require('../service/user');

const router = express.Router();

router.get('/id', ash(async (req, res) =>
{
  res.status(200).json(req.userID);
}));

router.get('/details', ash(async (req, res) =>
{
  const userDetails = await UserService.GetDetails(req.userID);
  res.status(200).json(userDetails);
}));

module.exports = router;

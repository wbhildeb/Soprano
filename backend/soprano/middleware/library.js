const express = require('express');
const ash = require('express-async-handler');
const LibraryService = require('../service/library');

const router = express.Router();

router.get('/all', ash(async (req, res) =>
{
  await LibraryService.GetAll(req.userID);
  res.status(200).send();
}));

module.exports = router;

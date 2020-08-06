
const express = require('express');
const env = require('../environment');
const ash = require('express-async-handler');
const AuthService = require('../service/auth');

const router = express.Router();

router.get('/login', (req, res) =>
{
  const url = AuthService.GetLoginRedirectURL(req.sessionID);

  res.redirect(url);
});

router.get('/logout', ash(async (req, res) =>
{
  await AuthService.Logout(req.sessionID);
  res.redirect('/');
}));

router.get('/notme', ash(async (req, res) =>
{
  await AuthService.Logout(req.sessionID);
  const url = AuthService.GetNotMeRedirectURL(req.sessionID);
  
  res.redirect(url);
}));

router.get('/callback', ash(async (req, res) =>
{
  const state = req.query.state;
  const code = req.query.code;
  const sessionID = req.sessionID;
  
  if (state != sessionID)
  {
    res.redirect('/error?reason=mismatched_state');
  }
  else
  {
    await AuthService.AddNewSession(sessionID, code);
    
    if (env.isProduction)
    {
      res.redirect('/sub-playlists');
    }
    else
    {
      res.redirect('localhost:4200/sub-playlists');
    }
  }
}));

module.exports = router;

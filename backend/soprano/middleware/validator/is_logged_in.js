const ash = require('express-async-handler');
const UserService = require('../../service/user');

module.exports = ash(async (req, res, next) =>
{
  const id = await UserService.GetID(req.sessionID);
  if (id)
  {
    req.userID = id;
    next();
  }
  else
  {
    res.status(401).send('Unauthenticated Session');
  }
});

const router = require('./router');

const { SessionDataInterface } = require('./data/interface');
const AuthService = require('./service/auth');
const SubPlaylistService = require('./service/sub_playlist');


SessionDataInterface.DeleteAll();

setInterval(
  AuthService.UpdateAllCredentials,
  20 * 60 * 1000
);

setInterval(
  SubPlaylistService.UpdateAll,
  60 * 60 * 1000
);

module.exports = router;

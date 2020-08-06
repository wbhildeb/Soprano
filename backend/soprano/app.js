const router = require('./router');
const env = require('./environment');
const { SessionDataInterface } = require('./data/interface');
const AuthService = require('./service/auth');
const DatabaseEmulatorInterface = require('./data/emulator_interface');
const SubPlaylistService = require('./service/sub_playlist');

const resolveBeforeReady = [];

if (env.isProduction)
{
  resolveBeforeReady.push(SessionDataInterface.DeleteAll());
}

if (env.emulateDatabase || env.emulateSpotify)
{
  resolveBeforeReady.push(DatabaseEmulatorInterface.InitData());
}

setInterval(
  AuthService.UpdateAllCredentials,
  20 * 60 * 1000
);

setInterval(
  SubPlaylistService.UpdateAll,
  60 * 60 * 1000
);

module.exports =
{
  router,
  ready: Promise.all(resolveBeforeReady)
};

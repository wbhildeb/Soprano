const firebase = require('firebase');
const env = require('../environment');
const path = require('path');

const emulator = firebase.initializeApp(env.firebase.info.emulator, 'emulator').database();

const mockDataDir = '../../../firebase_emulator/mock_data';

module.exports = class DatabaseEmulatorInterface
{
  static InitData()
  {
    if (env.emulateDatabase) 
    {
      this.SetUserData(env.firebase.mockData);
    }

    if (env.emulateSpotify) 
    {
      this.SetSpotifyData(env.spotify.mockData);
    }
  }

  static UserDataRoot()
  {
    if (!env.emulateDatabase)
    {
      throw new Error('Emulator not setup for the user database');
    }

    return emulator.ref('SopranoDB');
  }

  static SpotifyRoot()
  {
    if (!env.emulateSpotify)
    {
      throw new Error('Emulator not setup for Spotify');
    }

    return emulator.ref('SpotifyDB');
  }

  static async SetSpotifyData(file)
  {
    await this.SpotifyRoot().set(require(path.join(mockDataDir, 'spotify', file)));
  }
  
  static async SetUserData(file)
  {
    await this.UserDataRoot().set(require(path.join(mockDataDir, 'user', file)));
  }
};
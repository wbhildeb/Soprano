const firebase = require('firebase');

var firebaseConfig = {
  databaseURL: 'http://localhost:9000?ns=spotify-24cc8'
};

const database = firebase.initializeApp(firebaseConfig).database();
database.load = async obj => 
{
  return database.ref().set(obj);
};

module.exports = database;

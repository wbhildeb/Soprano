const firebase = require('firebase');
const env = require('./environment');

firebase.initializeApp(env.firebase);
const database = firebase.database();

class Database
{
  constructor()
  {
    this.session = require('./sessions')(database);
    this.user = require('./user')(database);
  }
}

/**
 * @returns {Database}
 */
module.exports = () => new Database();

const firebase = require('firebase');
const env = require('../environment');

firebase.initializeApp(env.firebase);
const database = firebase.database();

module.exports.session = require('./interface/session')(database);
module.exports.user = require('./interface/user')(database);

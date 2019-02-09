const mongoose = require('mongoose');

const sessionSchema = mongoose.Schema({
    sessionID: { type: String, required: true},
    authToken: { type: String, required: true },
    refreshToken: { type: String, required: true },
});

module.exports = mongoose.model('Session', sessionSchema);
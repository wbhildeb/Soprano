const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userID:         { type: String, required: true },
    displayName:    { type: String, required: true },
    imageURL:       { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);
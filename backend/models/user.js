const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    userID: { type: String, required: true},
    name: { type: String, required: true },
    imageURL: { type: String, default: 'https://cdn.pixilart.com/photos/large/50909fee485e6aa.jpg' },
});

module.exports = mongoose.model('User', userSchema);
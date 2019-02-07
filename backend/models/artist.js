const mongoose = require('mongoose');

const artistSchema = mongoose.Schema({
    name: { type: String, required: true },
    minutesListened: { type: Number, required: true },
    topSongs: { type: [String], required: false, default: []}
});

module.exports = mongoose.model('Artist', artistSchema);
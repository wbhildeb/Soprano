const mongoose = require('mongoose');

const trackSchema = mongoose.Schema({
    duration_ms:    { type: Number,  required: false },
    explicit:       { type: Boolean, required: false },
    href:           { type: String,  required: false },
    id:             { type: String,  required: false },
    name:           { type: String,  required: false },
    popularity:     { type: Number,  required: false },
    played_at:      { type: String,  required: false },
});

module.exports = mongoose.model('Track', trackSchema);
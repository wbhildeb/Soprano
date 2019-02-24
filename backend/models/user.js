const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    country:        { type: String, required: false },
    display_name:   { type: String, required: false },
    href:           { type: String, required: false },
    id:             { type: String, required: false },
    image_url:      { type: String, required: false },
    product:        { type: String, required: false },
    type:           { type: String, required: false },
    uri:            { type: String, required: false },
});

module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Forum', forumSchema);
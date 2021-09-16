const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    forumParent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Forum'
    },
    userParent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    upvotes: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Thread', threadSchema);
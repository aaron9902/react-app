const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
    reportedThread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    },
    desc: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Report', reportSchema);
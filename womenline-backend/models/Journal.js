// models/Journal.js
const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    entries: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('Journal', JournalSchema);
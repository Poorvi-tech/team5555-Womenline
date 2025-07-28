// models/PeriodLog.js
const mongoose = require('mongoose');

const PeriodLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    startDate: {    // 1
        type: Date,
        required: true
    },
    endDate: {     // 2
        type: Date,
        required: true
    },
    symptoms: {    // 3
        type: [String],
        default: []
    },
    mood: {        // 4
        type: String,
        enum: ['Happy', 'Sad', 'Anxious', 'Angry', 'Neutral'], // Example moods
        required: true
    },
    notes: {        // 5
        type: String,
        default: ''
    },
    cycleLength: {    // 6
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PeriodLog', PeriodLogSchema);
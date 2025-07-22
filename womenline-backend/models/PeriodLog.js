// models/PeriodLog.js
const mongoose = require('mongoose');

const PeriodLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    symptoms: {
        type: [String],
        default: []
    },
    mood: {
        type: String,
        enum: ['Happy', 'Sad', 'Anxious', 'Angry', 'Neutral'], // Example moods
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    cycleLength: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('PeriodLog', PeriodLogSchema);
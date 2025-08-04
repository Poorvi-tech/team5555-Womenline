const mongoose = require('mongoose');

const voiceEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    audioURL: { type: String, required: true },
    moodTag: { type: String, enum: ['happy', 'sad', 'neutral', 'angry', 'anxious'], required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VoiceEntry', voiceEntrySchema);

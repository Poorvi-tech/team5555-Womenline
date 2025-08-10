const mongoose = require('mongoose');

const voiceEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    audioURL: { type: String, required: true },
    moodTag: { type: String, enum: ['happy', 'sad', 'neutral', 'angry', 'anxious'], required: true },
    timestamp: { type: Date, default: Date.now },
    duration: { 
        type: Number,  
        required: true,
        validate: {
            validator: function(v) {
                return v <= 120; 
            },
            message: 'Duration must be less than or equal to 2 minutes.'
        }
    },
    transcription: { 
        type: String,  
        required: false  
    },
    tags: {
    type: String,
    required: true, // Optional tags for categorization
  },
  audiotype: {
    type: String,
    required:true, // Optional tags for categorization
  },
});

module.exports = mongoose.model('VoiceEntry', voiceEntrySchema);

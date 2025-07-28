// models/Journal.js
const mongoose = require('mongoose');

const JournalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  mood: {
    type: String,
    required: true
  },
  note: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  periodDay: {
    type: String
  },
  voiceNote: {
  type: String, // store file URL or path
  default: ''
}
}, { timestamps: true });

module.exports = mongoose.model('Journal', JournalSchema);

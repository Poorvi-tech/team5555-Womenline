const mongoose = require("mongoose");

// Schema for user journal entries (mood, notes, period tracking, etc.)
const JournalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    mood: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    periodDay: {
      type: String,
    },
    voiceNote: {
      type: String, // File path or URL to the voice note
      default: "",
    },
  },
  { timestamps: true }
); // Automatically adds createdAt & updatedAt fields

module.exports = mongoose.model("Journal", JournalSchema);

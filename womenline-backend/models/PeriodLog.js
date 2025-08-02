const mongoose = require("mongoose");

// Schema for tracking user's menstrual period logs
const PeriodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    startDate: {
      type: Date,
      required: true, // Period start date
    },
    endDate: {
      type: Date,
      required: true, // Period end date
    },
    symptoms: {
      type: [String], // List of symptoms (optional)
      default: [],
    },
    mood: {
      type: String,
      enum: ["Happy", "Sad", "Anxious", "Angry", "Neutral"], // Predefined mood options
      required: true,
    },
    notes: {
      type: String, // Additional notes (optional)
      default: "",
    },
    cycleLength: {
      type: Number, // Length of the menstrual cycle in days
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PeriodLog", PeriodLogSchema);

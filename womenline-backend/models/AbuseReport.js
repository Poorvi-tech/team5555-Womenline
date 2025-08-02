const mongoose = require("mongoose");

// Schema for Abuse Reports
const abuseReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for anonymous reports
  },
  type: {
    type: String,
    required: true, // Type of abuse (e.g., harassment, spam)
  },
  description: {
    type: String,
    required: true, // Detailed description of the abuse
  },
  location: {
    type: String,
    required: false, // Optional field for specifying location/context
  },
  timestamp: {
    type: Date,
    default: Date.now, // Auto-set to current timestamp
  },
});

// Index to optimize queries filtering by 'type'
abuseReportSchema.index({ type: 1 });

// Mongoose model export
const AbuseReport = mongoose.model("AbuseReport", abuseReportSchema);
module.exports = AbuseReport;

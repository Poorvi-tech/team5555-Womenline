const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Sub-schema for detailed activity log (embedded in MaCoin)
const activityLogSchema = new Schema(
  {
    type: {
      type: String, // Activity type (e.g., 'eco-action', 'challenge')
      required: true,
    },
    source: {
      type: String, // Source of the activity (e.g., 'journal', 'forum')
      required: true,
    },
    coins: {
      type: Number, // Credits earned from this activity
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { _id: false }
); // Prevent Mongoose from generating _id for sub-doc

// Main schema to log user's MaCoin earning history
const maCoinSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityLog: {
      type: activityLogSchema,
      required: true,
    },
    amount: {
      type: Number, // Total credits earned for this activity
      required: true,
    },
  },
  { timestamps: true }
); // Adds createdAt and updatedAt
maCoinSchema.index({ userId: 1 });
module.exports = mongoose.model("MaCoin", maCoinSchema);

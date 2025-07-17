const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activityLogSchema = new Schema({
  type: {
    type: String,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  coins: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  }
}, { _id: false });

const maCoinSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  activityLog: {
    type: activityLogSchema,
    required: true
  },
  amount: {
    type: Number,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("MaCoin", maCoinSchema);

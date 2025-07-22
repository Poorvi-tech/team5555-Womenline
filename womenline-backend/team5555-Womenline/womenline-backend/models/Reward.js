const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  cost: { type: Number, required: true },
  imageURL: { type: String },
  category: { type: String, default: "General" }
}, { timestamps: true });

module.exports = mongoose.model("Reward", rewardSchema);

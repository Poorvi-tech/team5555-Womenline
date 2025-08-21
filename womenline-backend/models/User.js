const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User Schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
    type: String,
    required: true
},
    role: {
      type: String,
      enum: ["admin", "user", "mother", "caregiver"],
      default: "user",
    },
    greenCredits: {
      type: Number,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    redemptionHistory: [{
      rewardId: { type: mongoose.Schema.Types.ObjectId, ref: "Reward" },
      redeemedAt: { type: Date, default: Date.now }
    }]
  },
  { timestamps: true }
);


// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

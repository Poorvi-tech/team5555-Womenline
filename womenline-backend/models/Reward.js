const mongoose = require("mongoose");

// Schema for Rewards that users can redeem with green credits
const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // Reward title (mandatory)
    },
    description: {
      type: String, // Reward description (optional)
    },
    cost: {
      type: Number,
      required: true, // Cost in green credits (mandatory)
    },
    imageURL: {
      type: String, // Image URL for the reward (optional)
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User ",
      required: false, // Optional: Admin/User who created the reward
    },
    category: {
      type: String,
      enum: ["Health", "Mental", "Supplements"], // Predefined categories
      default: null,
    },
    points: {
      type: Number,
      required: false, // Optional: Can be used for special reward point systems
    },
    redemptionHistory: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User ", // User who redeemed the reward
        },
        rewardId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Reward", // Reference to the redeemed reward
        },
        redeemedAt: {
          type: Date,
          default: Date.now, // Timestamp of redemption
        },
      },
    ],
    // New fields for tracking abuse and security
    maxDailyRedemptions: {
      type: Number,
      default: 5, // Default max redemptions per day
    },
    dailyRedemptionCount: {
      type: Number,
      default: 0, // Tracks how many times this reward has been redeemed today
    },
    lastRedemptionDate: {
      type: Date,
      default: null, // Tracks the last date this reward was redeemed
    },
  },
  { timestamps: true }
);

// Method to reset daily redemption count
rewardSchema.methods.resetDailyRedemptionCount = function () {
  const now = new Date();
  if (!this.lastRedemptionDate || this.lastRedemptionDate.toDateString() !== now.toDateString()) {
    this.dailyRedemptionCount = 0; // Reset count if a new day
    this.lastRedemptionDate = now; // Update last redemption date
  }
};

// Method to check if redemption is allowed
rewardSchema.methods.canRedeem = function () {
  this.resetDailyRedemptionCount(); // Ensure count is reset
  return this.dailyRedemptionCount < this.maxDailyRedemptions; // Check if under limit
};

// Method to increment redemption count
rewardSchema.methods.incrementRedemptionCount = function () {
  this.dailyRedemptionCount += 1; // Increment count
};

module.exports = mongoose.model("Reward", rewardSchema);

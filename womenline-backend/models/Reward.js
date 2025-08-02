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
      ref: "User",
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
          ref: "User", // User who redeemed the reward
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reward", rewardSchema);

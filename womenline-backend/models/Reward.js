const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  cost: { type: Number, required: true },
  imageURL: { type: String },
  category: { type: String, default: "General" },
  userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User' // Assuming you have a User model
    },
    category: {
        type: String,
        enum: ['Health', 'Mental', 'Supplements'], // Optional categories
        default: null
    },
    points: {
        type: Number,
        required: true
    },
    redemptionHistory: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        rewardId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Reward'
        },
        redeemedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

module.exports = mongoose.model("Reward", rewardSchema);

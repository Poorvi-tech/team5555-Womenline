// models/Rewards.js
const mongoose = require('mongoose');

const RewardsSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Rewards', RewardsSchema);
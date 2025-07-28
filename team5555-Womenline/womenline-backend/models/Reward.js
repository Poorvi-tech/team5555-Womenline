const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  cost: { type: Number, required: true },
  imageURL: { type: String },
 
  userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User',
  required: false // 🔁 was true
},
    category: {
        type: String,
        enum: ['Health', 'Mental', 'Supplements'], // Optional categories
        default: null
    },
    points: {
  type: Number,
  required: false // 🔁 was true
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

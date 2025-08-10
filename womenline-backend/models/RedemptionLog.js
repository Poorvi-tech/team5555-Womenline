const mongoose = require('mongoose');
 const  RedemptionLog = new mongoose.Schema({
      userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          rewardId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Reward", 
          },
          redeemedAt: {
            type: Date,
            required: true, 
          },
          status: {
            type: Boolean,
            default:false,
            required: true,
          },
          creditsUsed: {
            type: Number, 
            required: true
          }
 },
{ timestamps: true }
);


module.exports = mongoose.model('RedemptionLog', RedemptionLog);
const mongoose = require('mongoose');
const crypto = require('crypto');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User ', required: false },
  timestamp: { type: Date, default: Date.now },
  hash: { type: String, required: true },
  prevHash: { type: String }
});

// Function to calculate SHA256 Hash
auditLogSchema.methods.computeHash = function () {
  const data = `${this.action}|${this.details}|${this.userId}|${this.timestamp}|${this.prevHash || ''}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

// Method to log reward redemption
auditLogSchema.statics.logRewardRedemption = async function (userId, rewardId) {
  const logEntry = new this({
    action: 'Reward Redemption',
    details: `User  ${userId} redeemed reward ${rewardId}`,
    userId: userId,
  });
  logEntry.hash = logEntry.computeHash();
  await logEntry.save();
};

// Method to log forum post
auditLogSchema.statics.logForumPost = async function (userId, postId) {
  const logEntry = new this({
    action: 'Forum Post',
    details: `User  ${userId} created post ${postId}`,
    userId: userId,
  });
  logEntry.hash = logEntry.computeHash();
  await logEntry.save();
};

// Method to log forum reply
auditLogSchema.statics.logForumReply = async function (userId, postId) {
  const logEntry = new this({
    action: 'Forum Reply',
    details: `User  ${userId} replied to post ${postId}`,
    userId: userId,
  });
  logEntry.hash = logEntry.computeHash();
  await logEntry.save();
};

module.exports = mongoose.model('AuditLog', auditLogSchema);

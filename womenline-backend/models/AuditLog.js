const mongoose = require('mongoose');
const crypto = require('crypto');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: mongoose.Schema.Types.Mixed }, // Object bhi save hoga
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  timestamp: { type: Date, default: Date.now },
  hash: { type: String, required: true },
  prevHash: { type: String }
});

// Function to calculate SHA256 Hash
auditLogSchema.methods.computeHash = function () {
  const detailsString = typeof this.details === 'object'
    ? JSON.stringify(this.details)
    : this.details;
  const data = `${this.action}|${detailsString}|${this.userId}|${this.timestamp}|${this.prevHash || ''}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = mongoose.model('AuditLog', auditLogSchema);

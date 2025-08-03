const mongoose = require('mongoose');
const crypto = require('crypto');

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  timestamp: { type: Date, default: Date.now },
  hash: { type: String, required: true },
  prevHash: { type: String }
});

// Function to calculate SHA256 Hash
auditLogSchema.methods.computeHash = function () {
  const data = `${this.action}|${this.details}|${this.userId}|${this.timestamp}|${this.prevHash || ''}`;
  return crypto.createHash('sha256').update(data).digest('hex');
};

module.exports = mongoose.model('AuditLog', auditLogSchema);

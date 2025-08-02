const AuditLog = require('../models/AuditLog');

async function logAuditTrail(action, details, userId = null) {
  try {
    // Fetch last log to get prevHash
    const lastLog = await AuditLog.findOne().sort({ timestamp: -1 });

    const newLog = new AuditLog({
      action,
      details,
      userId,
      prevHash: lastLog ? lastLog.hash : null
    });

    // Compute hash after setting prevHash
    newLog.hash = newLog.computeHash();

    await newLog.save();
    console.log('✅ Audit trail logged:', action);
  } catch (err) {
    console.error('❌ Audit trail logging error:', err.message);
  }
}

module.exports = logAuditTrail;

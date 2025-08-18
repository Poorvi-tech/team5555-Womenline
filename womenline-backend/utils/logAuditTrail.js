const AuditLog = require("../models/AuditLog");

// Log an action to the audit trail
async function logAuditTrail(action, details, userId = null) {
  try {
    // Get the last log entry to link hashes
    const lastLog = await AuditLog.findOne().sort({ timestamp: -1 });

    // Create new audit log entry
    const newLog = new AuditLog({
      action,
      details,
      userId,
      prevHash: lastLog ? lastLog.hash : null,
    });

    // Compute hash for integrity
    newLog.hash = newLog.computeHash();

    // Save log entry
    await newLog.save();
    console.log("✅ Audit trail logged:", action);
  } catch (err) {
    console.error("❌ Audit trail logging error:", err.message);
  }
}

module.exports = logAuditTrail;

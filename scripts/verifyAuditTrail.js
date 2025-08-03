const mongoose = require('mongoose');
const crypto = require('crypto');
const AuditLog = require('../models/AuditLog');

async function verifyAuditTrail() {
  await mongoose.connect('mongodb://localhost:27017/YOUR_DB_NAME'); // Replace with your DB

  const logs = await AuditLog.find().sort({ timestamp: 1 }); // Oldest first

  for (let i = 1; i < logs.length; i++) {
    const prevLog = logs[i - 1];
    const currentLog = logs[i];

    // Recompute expected prevHash
    const expectedPrevHash = prevLog.computeHash();

    if (currentLog.prevHash !== expectedPrevHash) {
      console.error(`❌ Tampering detected at Log #${i + 1} (Action: ${currentLog.action})`);
      process.exit(1);
    }
  }

  console.log('✅ Audit Trail is Intact. No Tampering Detected.');
  process.exit(0);
}

verifyAuditTrail().catch((err) => {
  console.error('❌ Error verifying audit trail:', err);
  process.exit(1);
});

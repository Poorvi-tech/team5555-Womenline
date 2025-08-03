const PeriodLog = require("../models/PeriodLog");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// Log a new period cycle entry
exports.logPeriod = async (req, res) => {
  try {
    const { userId, startDate, endDate, symptoms, mood, notes, cycleLength } =
      req.body;

    const newLog = new PeriodLog({
      userId,
      startDate,
      endDate,
      symptoms,
      mood,
      notes,
      cycleLength,
    });

    await newLog.save();

    // 🔒 Tamper-Proof Audit Logging with Stringified Details
    await logAuditTrail(
      "PERIOD_LOG_CREATED",
      JSON.stringify({
        startDate,
        endDate,
        symptoms,
        mood,
        cycleLength,
      }),
      userId
    );

    logEvent("PERIOD_LOG_CREATED", `New period log added`, userId);
    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Fetch all period logs for a given user
exports.getPeriodLogs = async (req, res) => {
  try {
    const { userId } = req.params;

    const logs = await PeriodLog.find({ userId }).sort({ startDate: -1 });

    // 🔒 Audit log for fetch action with Stringified Details
    await logAuditTrail(
      "FETCH_PERIOD_LOGS",
      JSON.stringify({
        logCount: logs.length,
      }),
      userId
    );

    logEvent("FETCH_PERIOD_LOGS", `Fetched ${logs.length} period logs`, userId);

    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

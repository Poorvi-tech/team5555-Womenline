const PeriodLog = require('../models/PeriodLog');
const logEvent = require('../utils/logger');

exports.logPeriod = async (req, res) => {
  try {
    const { userId, startDate, endDate, symptoms, mood, notes, cycleLength } = req.body; // user details

    const newLog = new PeriodLog({
      userId,
      startDate,
      endDate,
      symptoms,
      mood,
      notes,
      cycleLength
    });

    await newLog.save();
    // ✅ Log the event after saving
logEvent('PERIOD_LOG_CREATED', `New period log added`, userId);
    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPeriodLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await PeriodLog.find({ userId }).sort({ startDate: -1 });
    // ✅ Log the fetch event
logEvent('FETCH_PERIOD_LOGS', `Fetched ${logs.length} period logs`, userId);
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

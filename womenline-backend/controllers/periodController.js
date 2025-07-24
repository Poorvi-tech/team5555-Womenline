const PeriodLog = require('../models/PeriodLog');

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
    res.status(201).json({ success: true, data: newLog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getPeriodLogs = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await PeriodLog.find({ userId }).sort({ startDate: -1 });
    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

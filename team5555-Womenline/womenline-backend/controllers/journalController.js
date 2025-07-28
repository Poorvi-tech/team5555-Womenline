const Journal = require('../models/Journal');
const logEvent = require('../utils/logger');

exports.createJournal = async (req, res) => {
  const { mood, note, periodDay, date } = req.body;
  const userId = req.user.id;
  const voiceNote = req.body.voiceNote || '';

  if (!mood || !note || !userId) {
    return res.status(400).json({ success: false, message: "Mood, note, and userId are required" });
  }

  try {
    const newJournal = new Journal({
      userId,
      mood,
      note,
      periodDay,
      date: date || new Date(), // if no date provided, use current date
       voiceNote
    });

    await newJournal.save();

    // ✅ Log this event
    logEvent('JOURNAL_CREATED', 'New journal entry created', userId);

    return res.status(201).json({ success: true, message: "Journal created", data: newJournal });
  } catch (error) {
    console.error("❌ Error creating journal:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all journal entries (future: fetch from DB)
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id }).sort({ date: -1 });

logEvent('FETCH_JOURNALS', `Fetched ${journals.length} journal entries`, req.user.id);

return res.json({ success: true, message: "Journals fetched", data: journals });

  } catch (error) {
    console.error("❌ Error fetching journals:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
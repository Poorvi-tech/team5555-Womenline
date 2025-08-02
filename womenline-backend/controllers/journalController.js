const Journal = require("../models/Journal");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// Create a new journal entry
exports.createJournal = async (req, res) => {
  const { mood, note, periodDay, date } = req.body;
  const userId = req.user.id;
  const voiceNote = req.body.voiceNote || ""; // Optional voice note path

  // Validate required fields
  if (!mood || !note || !userId) {
    await logAuditTrail(
      "Journal Creation Failed",
      JSON.stringify({ message: "Missing mood/note/userId" }),
      userId
    );
    return res
      .status(400)
      .json({ success: false, message: "Mood, note, and userId are required" });
  }

  try {
    // Create new journal entry document
    const newJournal = new Journal({
      userId,
      mood,
      note,
      periodDay,
      date: date || new Date(),
      voiceNote,
    });

    await newJournal.save();

    logEvent("JOURNAL_CREATED", "New journal entry created", userId);
    await logAuditTrail(
      "Journal Created",
      JSON.stringify({ mood, note, periodDay, voiceNote }),
      userId
    );

    return res
      .status(201)
      .json({ success: true, message: "Journal created", data: newJournal });
  } catch (error) {
    console.error("❌ Error creating journal:", error);
    await logAuditTrail(
      "Journal Creation Error",
      JSON.stringify({ error: error.message }),
      userId
    );
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Fetch all journal entries for the logged-in user
exports.getJournals = async (req, res) => {
  try {
    const journals = await Journal.find({ userId: req.user.id }).sort({
      date: -1,
    });

    logEvent(
      "FETCH_JOURNALS",
      `Fetched ${journals.length} journal entries`,
      req.user.id
    );
    await logAuditTrail(
      "Fetch Journals",
      JSON.stringify({ count: journals.length }),
      req.user.id
    );

    return res.json({
      success: true,
      message: "Journals fetched",
      data: journals,
    });
  } catch (error) {
    console.error("❌ Error fetching journals:", error);
    await logAuditTrail(
      "Fetch Journals Error",
      JSON.stringify({ error: error.message }),
      req.user.id
    );
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getJournals = async (req, res) => {
  // actual DB fetch can be added here later
  return res.json({ success: true, message: "Journals fetched", data: [] });
};

exports.createJournal = async (req, res) => {
  const { mood, note, periodDay } = req.body;
  const userId = req.user.id;

  if (!mood || !note || !userId) {
    return res.status(400).json({ success: false, message: "Mood, note, and userId are required" });
  }

  const newJournal = {
    userId,
    mood,
    note,
    periodDay
  };

  return res.status(201).json({ success: true, message: "Journal created", data: newJournal });
};

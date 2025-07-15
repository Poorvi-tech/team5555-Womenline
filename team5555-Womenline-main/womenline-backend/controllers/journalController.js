// import formatter
const { successResponse } = require('../utils/responseHandler');

exports.getJournals = (req, res) => {
  const dummyData = [
    { id: 1, title: "My First Journal", content: "This is a test." },
    { id: 2, title: "Second Entry", content: "Still testing!" }
  ];

  // using formatter:
  return res.json(successResponse("Fetched journals", dummyData));
  // not using formatter:
  // return res.json({ success: true, message: "Fetched journals", data: dummyData });
};

exports.createJournal = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: "Title and content required" });
  }

  const newJournal = { id: Date.now(), title, content };

  return res.status(201).json(successResponse("Journal created", newJournal));
};

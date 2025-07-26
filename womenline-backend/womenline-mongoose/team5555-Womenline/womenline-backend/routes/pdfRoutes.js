const express = require('express');
const router = express.Router();
const generateSamplePDF = require('../utils/pdfGenerator');
const Journal = require('../models/Journal');
const path = require('path');

// ✅ 1. SAMPLE DEMO PDF ROUTE
router.get('/sample', (req, res) => {
  const dummyData = {
    user: 'Poorvi Sahu',
    entries: [
      { mood: 'Happy', note: 'Had a great day!', date: '2025-07-01' },
      { mood: 'Stressed', note: 'Too many tasks', date: '2025-07-02' }
    ]
  };

  const outputPath = path.join(__dirname, '..', 'uploads', 'sample-report.pdf');
  generateSamplePDF(dummyData, outputPath);

  setTimeout(() => {
    res.download(outputPath);
  }, 1000);
});

// ✅ 2. EXPORT SUMMARY FROM DATABASE
router.get('/export-summary', async (req, res) => {
  try {
    const userId = "687905303317650ba386d5be"; // Replace with actual logged-in user ID later

    const fetchedJournals = await Journal.find({ userId });
    console.log("Fetched entries:", fetchedJournals);

    if (!fetchedJournals || fetchedJournals.length === 0) {
      return res.status(404).json({ success: false, message: "No journal entries found" });
    }

    // 🔥 Now we directly use fetchedJournals since each doc = one entry
    const formattedEntries = fetchedJournals.map(entry => ({
      mood: entry.mood || 'N/A',
      note: entry.note || 'N/A',
      date: entry.date ? new Date(entry.date).toLocaleDateString() : 'N/A'
    }));

    const dummyData = {
      user: "Poorvi Sahu", // Optional: fetch from User model if needed
      entries: formattedEntries
    };

    const outputPath = path.join(__dirname, '..', 'uploads', 'summary-report.pdf');
    generateSamplePDF(dummyData, outputPath);

    setTimeout(() => {
      res.download(outputPath);
    }, 1000);
  } catch (error) {
    console.error("❌ PDF Export Error:", error.message);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

module.exports = router;

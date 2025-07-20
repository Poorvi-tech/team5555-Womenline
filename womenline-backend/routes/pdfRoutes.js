const express = require('express');
const router = express.Router();
const generateSamplePDF = require('../utils/pdfGenerator');
const path = require('path');

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

  // Wait for a second and then send file
  setTimeout(() => {
    res.download(outputPath);
  }, 1000);
});

module.exports = router;

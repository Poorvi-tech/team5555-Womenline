// controllers/exportController.js
const path = require('path');
const fs = require('fs');

// ✅ 1. For summary export (already present)
exports.exportSummary = (req, res) => {
  const filePath = path.join(__dirname, '..', 'uploads', 'summary-report.pdf');
  
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Summary PDF not found.' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=summary-report.pdf');

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

// ✅ 2. For sample PDF (missing before)
exports.samplePdf = (req, res) => {
  const filePath = path.join(__dirname, '..', 'sample', 'health-summary.pdf');

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Sample PDF not found.' });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=health-summary.pdf');

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

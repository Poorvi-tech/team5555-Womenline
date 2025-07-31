const path = require('path');
const fs = require('fs');

exports.exportSummary = (req, res) => {
  const filePath = path.join(__dirname, '..', 'sample', 'health-summary.pdf');

  // Check if the file exists //
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Sample PDF not found.' });
  }

  // Set headers for download //
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=health-summary.pdf');

  // Stream the file
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

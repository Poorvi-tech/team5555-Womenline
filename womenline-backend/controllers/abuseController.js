// Dummy in-memory storage
const abuseReports = [];

exports.reportAbuse = (req, res) => {
  const { message, reportedBy = 'anonymous' } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string.' });
  }

  const newReport = {
    id: abuseReports.length + 1,
    message,
    reportedBy,
    reportedAt: new Date()
  };

  abuseReports.push(newReport);
  res.status(201).json({ message: 'Abuse reported successfully.' }); // abuse reported successfully
};

exports.getAbuseReports = (req, res) => {
  // Assume admin is already authenticated
  res.status(200).json(abuseReports);
};

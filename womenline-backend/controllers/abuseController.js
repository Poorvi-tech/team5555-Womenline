const logEvent = require("../utils/logger");

// In-memory storage for abuse reports (temporary, for demo/testing)
const abuseReports = [];

// Controller to handle abuse report submission
exports.reportAbuse = (req, res) => {
  const { message, reportedBy = "anonymous" } = req.body;

  // Validate message input
  if (!message || typeof message !== "string") {
    return res
      .status(400)
      .json({ error: "Message is required and must be a string." });
  }

  // Create new abuse report object
  const newReport = {
    id: abuseReports.length + 1,
    message,
    reportedBy,
    reportedAt: new Date(),
  };

  abuseReports.push(newReport);
  logEvent("ABUSE_REPORTED", `Abuse reported: "${message}"`, reportedBy);
  res.status(201).json({ message: "Abuse reported successfully." });
};

// Controller to fetch all abuse reports (admin-only)
exports.getAbuseReports = (req, res) => {
  logEvent(
    "FETCH_ABUSE_REPORTS",
    `Fetched ${abuseReports.length} abuse reports`
  );
  res.status(200).json(abuseReports);
};

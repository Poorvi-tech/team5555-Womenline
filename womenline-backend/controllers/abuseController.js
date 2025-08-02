const mongoose = require("mongoose");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// In-memory storage for abuse reports (temporary, for demo/testing)
const abuseReports = [];

// Controller to handle abuse report submission
exports.reportAbuse = async (req, res) => {
  const { message, reportedBy = "anonymous" } = req.body;

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

  const userId =
    req.user?.id || mongoose.Types.ObjectId("64b9e2e5f8a8e6f123456789"); // fallback ObjectId

  logEvent("ABUSE_REPORTED", `Abuse reported: "${message}"`, userId);
  await logAuditTrail(
    "Abuse Reported",
    JSON.stringify({ message, reportedBy }),
    userId
  );

  res.status(201).json({ message: "Abuse reported successfully." });
};

// Controller to fetch all abuse reports (admin-only)
exports.getAbuseReports = async (req, res) => {
  const userId =
    req.user?.id || mongoose.Types.ObjectId("64b9e2e5f8a8e6f123456789"); // fallback ObjectId

  logEvent(
    "FETCH_ABUSE_REPORTS",
    `Fetched ${abuseReports.length} abuse reports`,
    userId
  );
  await logAuditTrail(
    "Fetch Abuse Reports",
    JSON.stringify({ reportCount: abuseReports.length }),
    userId
  );

  res.status(200).json(abuseReports);
};

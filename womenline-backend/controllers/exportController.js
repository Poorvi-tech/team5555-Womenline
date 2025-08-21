const path = require("path");
const fs = require("fs");
const Journal = require("../models/Journal");
const generateSamplePDF = require("../utils/pdfGenerator");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// Helper to calculate mood summary
const calculateMoodSummary = (entries) => {
  const summary = {};
  for (const entry of entries) {
    const mood = entry.mood || "unknown";
    summary[mood] = (summary[mood] || 0) + 1;
  }
  return summary;
};

// Export dynamic Summary PDF generated from user's journal entries
const exportSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Journal.find({ userId });

    if (!entries || entries.length === 0) {
      logEvent("EXPORT_SUMMARY_FAIL", `No journal entries for user ${userId}`);
      await logAuditTrail("PDF Export Failed", JSON.stringify({ message: "No journal entries found", userId }), userId);
      return res.status(404).json({ success: false, message: "No journal entries found." });
    }

    // ✅ Deduplicate entries
    const uniqueEntriesMap = new Map();
    entries.forEach(entry => {
      const key = `${entry.date.toISOString().split("T")[0]}|${entry.mood}|${entry.note}`;
      if (!uniqueEntriesMap.has(key)) {
        uniqueEntriesMap.set(key, {
          mood: entry.mood,
          note: entry.note,
          date: entry.date.toISOString().split("T")[0],
        });
      }
    });

    const journalSummary = Array.from(uniqueEntriesMap.values());

    // ✅ Mood summary from deduplicated entries
    const moodSummary = calculateMoodSummary(journalSummary);

    const data = {
      user: {
        name: req.user.username || "Anonymous",
        email: req.user.email || "Not provided"
      },
      periodStatus: "Active",  // Future: fetch dynamically
      moodSummary,
      journalSummary
    };

    const outputPath = path.join(__dirname, "..", "uploads", "summary-report.pdf");
    await generateSamplePDF(data, outputPath);

    logEvent("EXPORT_SUMMARY_SUCCESS", `Summary PDF generated for user ${userId}`);
    await logAuditTrail("PDF Export", JSON.stringify({ message: "Summary PDF exported", entryCount: journalSummary.length }), userId);

    setTimeout(() => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=summary-report.pdf");
      const readStream = fs.createReadStream(outputPath);
      readStream.pipe(res);
    }, 1000);
  } catch (error) {
    console.error(error);
    await logAuditTrail("PDF Export Error", JSON.stringify({ error: error.message }), req.user?.id || "anonymous");
    res.status(500).json({
      success: false,
      message: "Failed to export summary",
      error: error.message,
    });
  }
};

module.exports = {
  exportSummary,
};

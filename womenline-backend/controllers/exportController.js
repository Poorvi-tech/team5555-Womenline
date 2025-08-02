const path = require("path");
const fs = require("fs");
const Journal = require("../models/Journal");
const generateSamplePDF = require("../utils/pdfGenerator");
const logEvent = require("../utils/logger");

// Export dynamic Summary PDF generated from user's journal entries
const exportSummary = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID from protect middleware
    const entries = await Journal.find({ userId });

    // If no journal entries found for the user
    if (!entries || entries.length === 0) {
      logEvent(
        "EXPORT_SUMMARY_FAIL",
        `No journal entries found for user ${userId}`
      );
      return res
        .status(404)
        .json({ success: false, message: "No journal entries found." });
    }

    // Prepare data for PDF generation
    const data = {
      user: req.user.username || "Anonymous",
      entries: entries.map((entry) => ({
        mood: entry.mood,
        note: entry.note,
        date: entry.date.toISOString().split("T")[0], // format date as YYYY-MM-DD
      })),
    };

    const outputPath = path.join(
      __dirname,
      "..",
      "uploads",
      "summary-report.pdf"
    );
    generateSamplePDF(data, outputPath);

    logEvent(
      "EXPORT_SUMMARY_SUCCESS",
      `Summary PDF generated for user ${userId}`
    );

    // Delay response slightly to ensure PDF file is written
    setTimeout(() => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=summary-report.pdf"
      );
      const readStream = fs.createReadStream(outputPath);
      readStream.pipe(res);
    }, 1000);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to export summary",
        error: error.message,
      });
  }
};

// Export static Sample PDF from sample folder
const samplePdf = (req, res) => {
  const filePath = path.join(__dirname, "..", "sample", "health-summary.pdf");

  // Check if sample PDF exists
  if (!fs.existsSync(filePath)) {
    logEvent("EXPORT_SAMPLE_PDF_FAIL", `Sample PDF not found`);
    return res.status(404).json({ error: "Sample PDF not found." });
  }

  logEvent("EXPORT_SAMPLE_PDF", `User downloaded health-summary.pdf`);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=health-summary.pdf"
  );

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
};

module.exports = {
  exportSummary,
  samplePdf,
};

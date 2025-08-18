const express = require("express");
const router = express.Router();
const abuseController = require("../controllers/abuseController");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// Report abuse (authenticated users)
router.post("/report-abuse", protect, abuseController.reportAbuse);

// Get all abuse reports (admin only)
router.get("/report-abuse", protect, rolecheck(['admin']), abuseController.getAbuseReports);

module.exports = router;
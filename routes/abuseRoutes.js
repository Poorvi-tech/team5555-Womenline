const express = require("express");
const router = express.Router();
const abuseController = require("../controllers/abuseController");
const { protect } = require("../middleware/authMiddleware");

// Report an abuse (requires user to be authenticated)
router.post("/report-abuse", protect, abuseController.reportAbuse);

// Fetch all abuse reports (admin access can be enforced via middleware if needed)
router.get("/report-abuse", protect, abuseController.getAbuseReports);

module.exports = router;

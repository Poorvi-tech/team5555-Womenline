const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// Get all journal entries (mother, caregiver, admin, user)
router.get(
  "/",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  journalController.getJournals
);

// Create a new journal entry (mother, caregiver, admin, user)
router.post(
  "/",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  journalController.createJournal
);

module.exports = router;

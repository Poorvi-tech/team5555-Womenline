const express = require("express");
const router = express.Router();
const journalController = require("../controllers/journalController");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// @route   GET /api/journal/
// @desc    Fetch all journal entries of the logged-in user
// @access  Protected (roles: mother, caregiver, admin, user)
router.get(
  "/",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  journalController.getJournals
);

// @route   POST /api/journal/
// @desc    Create a new journal entry for the logged-in user
// @access  Protected (roles: mother, caregiver, admin, user)
router.post(
  "/",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  journalController.createJournal
);

module.exports = router;

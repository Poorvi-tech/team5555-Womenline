const express = require("express");
const router = express.Router();

const { logPeriod, getPeriodLogs } = require("../controllers/periodController");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// Log a new period entry (mother, caregiver, admin, user)
router.post(
  "/period-log",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  logPeriod
);

// Get period logs for a user (mother, caregiver, admin, user)
router.get(
  "/period-log/:userId",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  getPeriodLogs
);

module.exports = router;

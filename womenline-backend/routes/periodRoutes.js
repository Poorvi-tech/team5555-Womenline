const express = require("express");
const router = express.Router();

const { logPeriod, getPeriodLogs } = require("../controllers/periodController");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// @route   POST /api/period/period-log
// @desc    Log a new period entry
// @access  Protected (Roles: mother, caregiver, admin, user)
router.post(
  "/period-log",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  logPeriod
);

// @route   GET /api/period/period-log/:userId
// @desc    Fetch period logs for a specific user
// @access  Protected (Roles: mother, caregiver, admin, user
router.get(
  "/period-log/:userId",
  protect,
  rolecheck(["mother", "caregiver", "admin", "user"]),
  getPeriodLogs
);

module.exports = router;

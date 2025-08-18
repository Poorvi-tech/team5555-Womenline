const express = require("express");
const router = express.Router();
const { calculateLeaderboard } = require("../utils/leaderboardCalc");
const { protect } = require("../middleware/authMiddleware");

let auditUtil = null;
try {
  auditUtil = require("../utils/logAuditTrail");
} catch (e) {
  auditUtil = null;
}

// Get leaderboard data
router.get("/", protect, async (req, res) => {
  try {
    const type = (req.query.type || "macoin").toLowerCase();
    const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
    const timeframe = (req.query.timeframe || "week").toLowerCase();
    const filters = {};
    if (req.query.userId) filters.userId = req.query.userId;

    const data = await calculateLeaderboard({
      type,
      timeframe,
      limit,
      filters,
    });

    // audit log (best-effort)
    try {
      if (auditUtil) {
        if (typeof auditUtil.log === "function") {
          // Correct parameter order: action, details, userId
          await auditUtil.log(
            "VIEW_LEADERBOARD",
            { type, limit, timeframe },
            req.user.id || req.user._id
          );
        } else if (typeof auditUtil === "function") {
          // Correct parameter order: action, details, userId
          await auditUtil(
            "VIEW_LEADERBOARD",
            { type, limit, timeframe },
            req.user.id || req.user._id
          );
        }
      }
    } catch (e) {
      console.warn("audit log failed:", e.message);
    }

    return res.json({ ok: true, data });
  } catch (err) {
    console.error("Leaderboard error:", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
});

module.exports = router;

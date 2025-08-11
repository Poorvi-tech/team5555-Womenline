const express = require("express");
const router = express.Router();

const rewardController = require("../controllers/rewardController");
const { redeemReward } = require("../controllers/rewardController");
const authMiddleware = require("../middleware/authMiddleware");
const AuditLog = require("../models/AuditLog");
const abusePrevention = require("../middlewares/abusePrevention");

// ----- Original Routes (Unchanged) -----

// @route   POST /api/reward/earn-credits
// @desc    Earn green credits based on activity + MaCoin abuse prevention (Task 1)
// @access  Public
router.post("/earn-credits", 
  authMiddleware.protect, 
  abusePrevention, // Added: MaCoin abuse prevention
  rewardController.earnCredits
);

// @route   GET /api/reward/
// @desc    Fetch all rewards
// @access  Public
router.get("/", rewardController.getRewards);

// @route   POST /api/reward/redeem
// @desc    Redeem a reward using credits + Audit logging (Task 3)
// @access  Protected
router.post(
  "/redeem",
  authMiddleware.protect,
  authMiddleware.rolecheck(["mother", "caregiver", "admin", "user"]),
  async (req, res, next) => {
    try {
      const result = await redeemReward(req, res);
      // Audit log the redemption (Task 3)
      await AuditLog.logRewardRedemption(req.user._id, req.body.rewardId);
      return result;
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/reward/user-credits
// @desc    Get current user's green credits
// @access  Protected
router.get("/user-credits",
  authMiddleware.protect,
  rewardController.getUserCredits
);

module.exports = router;

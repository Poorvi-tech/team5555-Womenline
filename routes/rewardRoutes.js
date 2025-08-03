const express = require("express");
const router = express.Router();

const rewardController = require("../controllers/rewardController");
const { redeemReward } = require("../controllers/rewardController");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/reward/earn-credits
// @desc    Earn green credits based on activity
// @access  Public
router.post("/earn-credits", rewardController.earnCredits);

// @route   GET /api/reward/
// @desc    Fetch all rewards
// @access  Public
router.get("/", rewardController.getRewards);

// @route   POST /api/reward/redeem
// @desc    Redeem a reward using credits
// @access  Protected (mother, caregiver, admin, user)
router.post(
  "/redeem",
  authMiddleware.protect,
  authMiddleware.rolecheck(["mother", "caregiver", "admin", "user"]),
  redeemReward
);

// @route   GET /api/reward/user-credits
// @desc    Get current user's green credits
// @access  Protected
router.get(
  "/user-credits",
  authMiddleware.protect,
  rewardController.getUserCredits
);

module.exports = router;

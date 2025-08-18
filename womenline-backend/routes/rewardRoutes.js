const express = require("express");
const router = express.Router();

const rewardController = require("../controllers/rewardController");
const { redeemReward } = require("../controllers/rewardController");
const authMiddleware = require("../middleware/authMiddleware");
const abusePrevention = require("../middleware/abusePrevention");
const { getRedemptionHistory } = require('../controllers/rewardController');


// Earn credits (protected)
router.post(
  "/earn-credits",
  authMiddleware.protect,
  abusePrevention, 
  rewardController.earnCredits
);

// Get all rewards (public)
router.get("/", rewardController.getRewards);

// Redeem a reward (mother, caregiver, admin, user)
router.post(
  "/redeem",
  authMiddleware.protect,
  authMiddleware.rolecheck(["mother", "caregiver", "admin", "user"]),
  redeemReward
);

// Get user's green credits (protected)
router.get(
  "/user-credits",
  authMiddleware.protect,
  rewardController.getUserCredits
);

// Get user's redemption history (protected)
router.get(
  '/user/redemption-history',
  authMiddleware.protect,
  rewardController.getRedemptionHistory
);


module.exports = router;

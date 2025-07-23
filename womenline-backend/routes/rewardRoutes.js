const express = require("express");
const router = express.Router();
const rewardController = require("../controllers/rewardController");
const { redeemReward } = require('../controllers/rewardController');
const authMiddleware = require("../middleware/authMiddleware");

// Earn Credits API
router.post("/earn-credits", rewardController.earnCredits);
// get reward
router.get("/", rewardController.getRewards);
// post reedem reward
router.post("/redeem", authMiddleware.protect,authMiddleware.rolecheck(['user','admin','mother']),redeemReward);


module.exports = router;

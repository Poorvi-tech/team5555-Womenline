const MaCoin = require("../models/MaCoins");
const User = require("../models/User");
const calculateCredits = require("../utils/creditCalculator");

exports.earnCredits = async (req, res) => {
  try {
    const { userId, activityType, source } = req.body;

    if (!userId || !activityType || !source) {
      return res.status(400).json({ success: false, message: "userId, activityType, and source are required" });
    }

    const coinsEarned = calculateCredits(activityType);

    // Update user balance
    await User.findByIdAndUpdate(userId, { $inc: { greenCredits: coinsEarned } });

    // Log activity in MaCoin model
    const maCoinEntry = new MaCoin({
      userId,
      activityLog: {
        type: activityType,
        source,
        coins: coinsEarned
      },
      amount: coinsEarned
    });

    await maCoinEntry.save();

    return res.status(200).json({
      success: true,
      message: "Credits earned successfully",
      data: {
        coinsEarned
      }
    });
  } catch (error) {
    console.error("Earn Credits Error:", error);
    return res.status(500).json({ success: false, message: "Server error", error });
  }
};
const Reward = require("../models/Reward");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();
    return res.status(200).json(successResponse("Rewards fetched", rewards));
  } catch (error) {
    return res.status(500).json(errorResponse("Error fetching rewards", error));
  }
};
// redeem rewards
exports.redeemReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rewardId, cost } = req.body;

    if (!rewardId || !cost) {
      return res.status(400).json(errorResponse("rewardId and cost are required"));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json(errorResponse("User not found"));

    if (user.greenCredits < cost) {
      return res.status(400).json(errorResponse("Not enough credits to redeem this reward"));
    }

    user.greenCredits -= cost;
    await user.save();

    return res.status(200).json(successResponse("Reward redeemed successfully", {
      rewardId,
      remainingCredits: user.greenCredits
    }));
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to redeem reward", error));
  }
};

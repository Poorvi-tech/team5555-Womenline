const MaCoin = require("../models/MaCoins");
const User = require("../models/User");
const calculateCredits = require("../utils/creditCalculator");
const Reward = require("../models/Reward");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const logEvent = require("../utils/logger"); // ✅ add this line

exports.earnCredits = async (req, res) => {
  try {
    const { userId, activityType, source } = req.body;

    // ✅ Corrected validation message
    if (!userId || !activityType || !source) {
      return res
        .status(400)
        .json(errorResponse("userId, activityType, and source are required"));
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

    // ✅ Log success
logEvent("EARN_CREDITS", `+${coinsEarned} credits for ${activityType} via ${source}`, userId);

    return res.status(200).json(successResponse("Credits earned successfully", {
      coinsEarned
    }));
  } catch (error) {
    console.error("Earn Credits Error:", error);
    return res.status(500).json(errorResponse("Server error", error));
  }
};

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
exports.getUserCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select('greenCredits');
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }
logEvent("FETCH_CREDITS", `User credits fetched`, userId);

    return res.status(200).json(successResponse("User credits fetched", {
      greenCredits: user.greenCredits
    }));
    
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to fetch user credits", error));
  }
};

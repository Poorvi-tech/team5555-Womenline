const MaCoin = require("../models/MaCoins");
const User = require("../models/User");
const calculateCredits = require("../utils/creditCalculator");
const Reward = require("../models/Reward");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// Earn green credits based on activity type & log in MaCoin history
exports.earnCredits = async (req, res) => {
  try {
     const { activityType, source } = req.body;
     const userId = req.user.id;

    if (!userId || !activityType || !source) {
      return res
        .status(400)
        .json(errorResponse("userId, activityType, and source are required"));
    }

    const coinsEarned = calculateCredits(activityType);

    // Update user's greenCredits balance
    await User.findByIdAndUpdate(userId, {
      $inc: { greenCredits: coinsEarned },
    });

    // Log the activity in MaCoin collection
    const maCoinEntry = new MaCoin({
      userId,
      activityLog: {
        type: activityType,
        source,
        coins: coinsEarned,
      },
      amount: coinsEarned,
    });

    await maCoinEntry.save();

    logEvent(
      "EARN_CREDITS",
      `+${coinsEarned} credits for ${activityType} via ${source}`,
      userId
    );

    // 🔒 Audit Trail Logging with stringified details
    await logAuditTrail(
      "EARN_CREDITS",
      JSON.stringify({
        activityType,
        source,
        coinsEarned,
      }),
      userId
    );

    return res.status(200).json(
      successResponse("Credits earned successfully", {
        coinsEarned,
      })
    );
  } catch (error) {
    console.error("Earn Credits Error:", error);
    return res.status(500).json(errorResponse("Server error", error));
  }
};

// Fetch available rewards from Reward collection
exports.getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find();

    // 🔒 Audit Trail for Rewards Fetch (Stringified details)
    await logAuditTrail(
      "FETCH_REWARDS",
      JSON.stringify({
        totalRewards: rewards.length,
      }),
      req.user?.id || null
    );

    return res.status(200).json(successResponse("Rewards fetched", rewards));
  } catch (error) {
    return res.status(500).json(errorResponse("Error fetching rewards", error));
  }
};

// Redeem a reward using user’s greenCredits
exports.redeemReward = async (req, res) => {
  try {
    const userId = req.user.id;
    const { rewardId, cost } = req.body;

    if (!rewardId || !cost) {
      return res
        .status(400)
        .json(errorResponse("rewardId and cost are required"));
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json(errorResponse("User not found"));

    if (user.greenCredits < cost) {
      return res
        .status(400)
        .json(errorResponse("Not enough credits to redeem this reward"));
    }

    // Deduct credits after redemption
    user.greenCredits -= cost;
    await user.save();

    logEvent(
      "REDEEM_REWARD",
      `Reward ${rewardId} redeemed. Cost: ${cost}`,
      userId
    );

    // 🔒 Audit Trail Logging (Stringified details)
    await logAuditTrail(
      "REDEEM_REWARD",
      JSON.stringify({
        rewardId,
        cost,
        remainingCredits: user.greenCredits,
      }),
      userId
    );

    return res.status(200).json(
      successResponse("Reward redeemed successfully", {
        rewardId,
        remainingCredits: user.greenCredits,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Failed to redeem reward", error));
  }
};

// Get user's current greenCredits balance
exports.getUserCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("greenCredits");
    if (!user) {
      return res.status(404).json(errorResponse("User not found"));
    }
    logEvent("FETCH_CREDITS", `User credits fetched`, userId);

    // 🔒 Audit Trail Logging (Stringified details)
    await logAuditTrail(
      "FETCH_CREDITS",
      JSON.stringify({
        greenCredits: user.greenCredits,
      }),
      userId
    );

    return res.status(200).json(
      successResponse("User credits fetched", {
        greenCredits: user.greenCredits,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(errorResponse("Failed to fetch user credits", error));
  }
};

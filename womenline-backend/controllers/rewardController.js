const User = require("../models/User");
const Reward = require("../models/Reward");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

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
    const { rewardId } = req.body; // cost ab body me lene ki zarurat nahi

    if (!rewardId) {
      return res.status(400).json(errorResponse("rewardId is required"));
    }

    // ✅ Step 1: Reward validate karo
    const reward = await Reward.findById(rewardId);
    if (!reward) {
      return res.status(404).json(errorResponse("Reward not found"));
    }

    // ✅ Step 2: User validate karo
    const user = await User.findById(userId);
    if (!user) return res.status(404).json(errorResponse("User not found"));

    // ✅ Step 3: Sufficient credits check karo
    if (user.greenCredits < reward.cost) {
      return res.status(400).json(errorResponse("Not enough credits to redeem this reward"));
    }

    // ✅ Step 4: Deduct credits
    user.greenCredits -= reward.cost;

    // ✅ Step 5: Correct rewardId store karo
    user.redemptionHistory = user.redemptionHistory || [];
    user.redemptionHistory.push({
      rewardId: reward._id, // Reward collection ka _id
      redeemedAt: new Date()
    });
    await user.save();

    // ✅ Step 6: Reward ki redemption history update karo
    await Reward.findByIdAndUpdate(reward._id, {
      $push: {
        redemptionHistory: {
          userId: userId,
          rewardId: reward._id,
          redeemedAt: new Date()
        }
      }
    });

    // ✅ Logging
    logEvent("REDEEM_REWARD", `Reward ${reward._id} redeemed. Cost: ${reward.cost}`, userId);

    await logAuditTrail(
      "REDEEM_REWARD",
      JSON.stringify({
        rewardId: reward._id,
        cost: reward.cost,
        remainingCredits: user.greenCredits,
      }),
      userId
    );

    return res.status(200).json(
      successResponse("Reward redeemed successfully", {
        rewardId: reward._id,
        remainingCredits: user.greenCredits,
      })
    );
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to redeem reward", error));
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

// GET redemption history for logged-in user (only valid rewards)
exports.getRedemptionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId)
      .select('redemptionHistory')
      .populate({
        path: 'redemptionHistory.rewardId',
        select: 'title description cost imageURL'
      });

    if (!user) {
      await logEvent("FETCH_REDEMPTION_FAILED", "User not found", userId);
      await logAuditTrail("FETCH_REDEMPTION_FAILED", "User not found", userId);
      return res.status(404).json(errorResponse('User not found'));
    }

    // Filter only valid rewards (rewardId not null)
    const formattedHistory = user.redemptionHistory
      .filter(entry => entry.rewardId) // removes broken/null refs
      .map(entry => ({
        title: entry.rewardId.title,
        description: entry.rewardId.description,
        cost: entry.rewardId.cost,
        imageURL: entry.rewardId.imageURL,
        redeemedAt: entry.redeemedAt
      }));

      logEvent("FETCH_REDEMPTION_HISTORY", "Redemption history fetched", userId);
    await logAuditTrail(
      "FETCH_REDEMPTION_HISTORY",
      JSON.stringify({ total: formattedHistory.length }),
      userId
    );

    return res
      .status(200)
      .json(successResponse("Redemption history fetched", formattedHistory));

  } catch (error) {
    console.error('Error fetching redemption history:', error);
    await logEvent("FETCH_REDEMPTION_ERROR", error.message, req.user.id);
    await logAuditTrail("FETCH_REDEMPTION_ERROR", error.message, req.user.id);
    res.status(500).json(errorResponse('Server error', error));
  }
};
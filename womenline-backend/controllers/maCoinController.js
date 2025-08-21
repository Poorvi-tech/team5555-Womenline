const MaCoin = require("../models/MaCoins");
const User = require("../models/User");
const calculateCredits = require("../utils/creditCalculator");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// ✅ Earn green credits based on activityType & log in MaCoin history
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

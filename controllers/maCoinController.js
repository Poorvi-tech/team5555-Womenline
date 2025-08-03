const User = require("../models/User");
const MaCoin = require("../models/MaCoins");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// Controller to allow a user to earn green credits (MaCoins)
exports.earnCredits = async (req, res) => {
  try {
    const userId = req.user.id; // Authenticated user's ID from protect middleware
    const { type, source, coins } = req.body;

    // Validate required fields
    if (!type || !source || !coins) {
      return res
        .status(400)
        .json(errorResponse("All fields (type, source, coins) are required"));
    }

    // Fetch user from DB
    const user = await User.findById(userId);
    if (!user) return res.status(404).json(errorResponse("User not found"));

    // Update user's greenCredits balance
    user.greenCredits += coins;
    await user.save();

    // Log this earning in MaCoins collection
    const newLog = new MaCoin({
      userId,
      amount: coins,
      activityLog: { type, source, coins },
    });

    await newLog.save();

    // Tamper-Proof Audit Trail Logging
    await logAuditTrail(
      "EARN_CREDITS",
      JSON.stringify({
        type,
        source,
        coins,
        updatedBalance: user.greenCredits,
      }),
      userId
    );

    logEvent(
      "EARN_CREDITS",
      `User earned ${coins} credits from ${source}`,
      userId
    );

    return res
      .status(200)
      .json(
        successResponse("Credits earned", { greenCredits: user.greenCredits })
      );
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to earn credits", error));
  }
};

const User = require("../models/User");
const MaCoin = require("../models/MaCoins");
const { successResponse, errorResponse } = require("../utils/responseHandler");

exports.earnCredits = async (req, res) => {
  try {
    const userId = req.user.id; // from authMiddleware
    const { type, source, coins } = req.body;

    if (!type || !source || !coins) {
      return res.status(400).json(errorResponse("All fields (type, source, coins) are required"));
    }

    // 1. Update user's greenCredits
    const user = await User.findById(userId);
    if (!user) return res.status(404).json(errorResponse("User not found"));

    user.greenCredits += coins;
    await user.save();

    // 2. Create MaCoin log
    const newLog = new MaCoin({
      userId,
      amount: coins,
      activityLog: { type, source, coins }
    });

    await newLog.save();

    return res.status(200).json(successResponse("Credits earned", { greenCredits: user.greenCredits }));
  } catch (error) {
    return res.status(500).json(errorResponse("Failed to earn credits", error));
  }
};

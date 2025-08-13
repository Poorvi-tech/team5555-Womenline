// middleware/abusePrevention.js
const calculateCredits = require("../utils/creditCalculator"); // rewardController wale calculation ke liye

// Daily earning limit (example: 3 credits or 3 coins)
const DAILY_LIMIT = 100;

// User ke daily coins track karne ke liye temporary in-memory store
// Production me ise DB me store karna chahiye
const userDailyData = {};

module.exports = function abusePrevention(req, res, next) {
  try {
    const userId = req.user?.id || req.body.userId; // user identify karne ke liye
    if (!userId) {
      return res.status(400).json({ message: "User ID required" });
    }

    // Request me coins ka value nikalna
    let coins = 0;

    // Case 1: maCoinController jaha coins body me directly aate hain
    if (req.body.coins) {
      coins = Number(req.body.coins);
    }
    // Case 2: rewardController jaha coins calculate hote hain activityType se
    else if (req.body.activityType) {
      coins = calculateCredits(req.body.activityType);
    }

    if (!coins || coins <= 0) {
      return res.status(400).json({ message: "Invalid coins/credits" });
    }

    const today = new Date().toISOString().split("T")[0];
    if (!userDailyData[userId]) {
      userDailyData[userId] = { date: today, earned: 0 };
    }

    // Agar date change ho gayi hai to reset kar do
    if (userDailyData[userId].date !== today) {
      userDailyData[userId] = { date: today, earned: 0 };
    }

    // Check limit
    if (userDailyData[userId].earned + coins > DAILY_LIMIT) {
      return res.status(429).json({
        message: `Daily limit of ${DAILY_LIMIT} coins/credits reached.`,
      });
    }

    // Update earned coins
    userDailyData[userId].earned += coins;

    next();
  } catch (err) {
    console.error("Abuse prevention error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};
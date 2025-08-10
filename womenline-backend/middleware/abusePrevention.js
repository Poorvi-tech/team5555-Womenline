const MAX_DAILY_EARNINGS = 100;
const userEarnings = new Map();

module.exports = (req, res, next) => {
  const userId = req.user.id; // From auth middleware
  const currentTime = Date.now();
  
  // Reset if 24h passed
  if (!userEarnings.has(userId) || 
      currentTime - userEarnings.get(userId).lastReset > 86400000) {
    userEarnings.set(userId, { earned: 0, lastReset: currentTime });
  }

  // Check limit (assuming req.body.amount exists)
  const userData = userEarnings.get(userId);
  if (userData.earned + req.body.amount > MAX_DAILY_EARNINGS) {
    return res.status(429).json({ 
      error: `Max ${MAX_DAILY_EARNINGS} MaCoin/day exceeded` 
    });
  }

  // Log successful earning
  userData.earned += req.body.amount;
  next();
};

const POST_LIMIT = 3; // Per hour
const OFFENSIVE_WORDS = new Set(['hate', 'abuse', 'spam']);
const userPosts = new Map();

module.exports = (req, res, next) => {
  const userId = req.user.id;
  const now = Date.now();

  // Initialize user tracking
  if (!userPosts.has(userId)) {
    userPosts.set(userId, []);
  }

  // Remove old posts (>1h)
  const recentPosts = userPosts.get(userId).filter(
    t => now - t < 3600000
  );

  // Check limit
  if (recentPosts.length >= POST_LIMIT) {
    return res.status(429).json({ 
      error: `Max ${POST_LIMIT} posts/hour allowed` 
    });
  }

  // Check offensive content
  if (OFFENSIVE_WORDS.has(req.body.message.toLowerCase())) {
    return res.status(400).json({ 
      error: "Message contains blocked terms" 
    });
  }

  // Allow post
  userPosts.set(userId, [...recentPosts, now]);
  next();
};

// Middleware to moderate abusive comments
const commentModeration = async (req, res, next) => {
  const { comment } = req.body;

  // Validate comment presence
  if (!comment || comment.trim() === "") {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  // Dynamically import profanity filter
  const { default: profanities } = await import("profanities");

  // Check for inappropriate content
  if (profanities(comment)) {
    return res
      .status(400)
      .json({ message: "Your comment contains inappropriate content." });
  }

  next(); // Proceed if comment is clean
};

module.exports = { commentModeration };

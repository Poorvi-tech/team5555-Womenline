
const commentModeration = async (req, res, next) => {
  const { comment } = req.body;

  if (!comment || comment.trim() === '') {
    return res.status(400).json({ message: 'Comment cannot be empty' });
  }


  const { default: profanities } = await import('profanities');  // Use `await import`

  if (profanities(comment)) {
    return res.status(400).json({ message: "Your comment contains inappropriate content." });
  }

  next();
};

module.exports = { commentModeration };

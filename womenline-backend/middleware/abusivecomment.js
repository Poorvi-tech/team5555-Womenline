// middleware/abusivecomment.js
let profanities = require("profanities");

// Agar yeh default property me ho
if (profanities.default && Array.isArray(profanities.default)) {
  profanities = profanities.default;
}

// Agar yeh profanities property me ho
if (profanities.profanities && Array.isArray(profanities.profanities)) {
  profanities = profanities.profanities;
}

const commentModeration = (req, res, next) => {
  const { reply } = req.body;

  if (!reply || reply.trim() === "") {
    return res.status(400).json({ message: "Comment cannot be empty" });
  }

  // Ab safe check
  const containsProfanity = Array.isArray(profanities) && profanities.some((word) =>
    reply.toLowerCase().includes(word.toLowerCase())
  );

  if (containsProfanity) {
    return res
      .status(400)
      .json({ message: "Your comment contains inappropriate content." });
  }

  next();
};

module.exports = { commentModeration };

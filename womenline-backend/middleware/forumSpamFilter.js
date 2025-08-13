// middleware/forumSpamFilter.js
const ForumPost = require("../models/ForumPost");
const mongoose = require("mongoose");
let profanities = require("profanities");

if (profanities.default && Array.isArray(profanities.default)) profanities = profanities.default;
if (profanities.profanities && Array.isArray(profanities.profanities)) profanities = profanities.profanities;

const POST_LIMIT =3;
const REPLY_LIMIT = 3;
const HOUR_MS = 60 * 60 * 1000;

const forumSpamFilter = async (req, res, next) => {
  try {
    const userId = req.user?.id || new mongoose.Types.ObjectId();
    const now = Date.now();
    const message = (req.body.title || req.body.content || req.body.reply || "").trim().toLowerCase();

    if (!message) return res.status(400).json({ message: "Message content is required." });

    // Offensive check
    const containsProfanity = Array.isArray(profanities) && profanities.some(word => message.includes(word.toLowerCase()));
    if (containsProfanity) return res.status(400).json({ message: "Message contains inappropriate content." });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Check if it's a post request
    if (req.originalUrl.includes("/forum-post")) {
      const posts = await ForumPost.find({
        userId: userObjectId,
        createdAt: { $gte: new Date(now - HOUR_MS) },
      }).lean();

      if (posts.length >= POST_LIMIT) {
        return res.status(429).json({ message: `Post limit reached. Maximum ${POST_LIMIT} per hour.` });
      }

      // Repeated message check in posts only
      const lastMessages = posts.map(p => p.content.toLowerCase());
      if (lastMessages.includes(message)) {
        return res.status(400).json({ message: "Repeated message detected." });
      }
    }

    // Check if it's a reply request
    if (req.originalUrl.includes("/forum-reply")) {
      const recentReplies = await ForumPost.aggregate([
        { $match: { "replies.userId": userObjectId } },
        { $unwind: "$replies" },
        { $match: { "replies.userId": userObjectId, "replies.createdAt": { $gte: new Date(now - HOUR_MS) } } },
        { $project: { content: "$replies.content", createdAt: "$replies.createdAt" } }
      ]);

      if (recentReplies.length >= REPLY_LIMIT) {
        return res.status(429).json({ message: `Reply limit reached. Maximum ${REPLY_LIMIT} per hour.` });
      }

      // Repeated message check in replies only
      const lastMessages = recentReplies.map(r => r.content.toLowerCase());
      if (lastMessages.includes(message)) {
        return res.status(400).json({ message: "Repeated message detected." });
      }
    }

    next();
  } catch (err) {
    console.error("Forum spam filter error:", err);
    return res.status(500).json({ message: "Server error in forum spam filter." });
  }
};

module.exports = { forumSpamFilter };
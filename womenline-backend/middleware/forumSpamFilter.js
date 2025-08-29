const ForumPost = require("../models/ForumPost");
const mongoose = require("mongoose");
let profanities = require("profanities");

if (profanities.default && Array.isArray(profanities.default)) profanities = profanities.default;
if (profanities.profanities && Array.isArray(profanities.profanities)) profanities = profanities.profanities;

const POST_LIMIT = 3;
const REPLY_LIMIT = 3;
const HOUR_MS = 60 * 60 * 1000;

const forumSpamFilter = async (req, res, next) => {
  try {
    const userId = req.user?.id || new mongoose.Types.ObjectId();
    const now = Date.now();
    const message = (req.body.title || req.body.content || req.body.reply || "").trim().toLowerCase();

    if (!message) return res.status(400).json({ message: "Message content is required." });

    // ✅ Improved Offensive check (word boundary)
    const containsProfanity = Array.isArray(profanities) && profanities.some(word => {
      const regex = new RegExp(`\\b${word}\\b`, "i");
      return regex.test(message);
    });
    if (containsProfanity) return res.status(400).json({ message: "Message contains inappropriate content." });

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Post request spam check
    if (req.originalUrl.includes("/forum-post")) {
      const posts = await ForumPost.find({
        userId: userObjectId,
        createdAt: { $gte: new Date(now - HOUR_MS) },
      }).lean();

      if (posts.length >= POST_LIMIT) {
        return res.status(429).json({ message: `Post limit reached. Maximum ${POST_LIMIT} per hour.` });
      }

      const lastMessages = posts.map(p => p.content.toLowerCase());
      if (lastMessages.includes(message)) {
        return res.status(400).json({ message: "Repeated message detected." });
      }
    }

    // Reply request spam check
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

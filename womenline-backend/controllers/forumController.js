// controllers/forumController.js
const ForumPost = require("../models/ForumPost");
const mongoose = require("mongoose");
const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// Create a new forum post
exports.createForumPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const userId = req.user?.id || new mongoose.Types.ObjectId();

    if (!title || !content) {
      logEvent("FORUM_POST_CREATE_FAIL", "Missing title or content", userId);
      await logAuditTrail(
        "Forum Post Failed",
        JSON.stringify({ message: "Missing title or content" }),
        userId
      );
      return res.status(400).json({ error: "Title and content are required." });
    }

    const newPost = await ForumPost.create({
      userId,
      content,
      tags: [], // Optional: can be extended
    });

    logEvent("FORUM_POST_CREATED", `Forum post created`, userId);
    await logAuditTrail(
      "Forum Post Created",
      JSON.stringify({ content, createdAt: newPost.createdAt }),
      userId
    );

    res.status(201).json({ postId: newPost._id, createdAt: newPost.createdAt });
  } catch (err) {
    console.error("Error creating forum post:", err);
    res.status(500).json({ error: "Server error creating forum post" });
  }
};

// Add a reply to a forum post
exports.addForumReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const postId = req.params.postId;
    const userId = req.user?.id || new mongoose.Types.ObjectId();

    if (!reply) return res.status(400).json({ error: "Reply content is required." });

    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Forum post not found." });

    post.replies.push({
      userId,
      content: reply,
      createdAt: new Date(),
    });

    await post.save();

    logEvent("FORUM_REPLY_ADDED", `Reply added to Post ID ${postId}`, userId);
    await logAuditTrail(
      "Forum Reply Added",
      JSON.stringify({ postId, reply }),
      userId
    );

    res.status(200).json({ message: "Reply added successfully.", replies: post.replies });
  } catch (err) {
    console.error("Error adding forum reply:", err);
    res.status(500).json({ error: "Server error adding reply" });
  }
};

// Get all replies for a forum post
exports.getForumReplies = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await ForumPost.findById(postId).lean();

    if (!post) return res.status(404).json({ error: "Forum post not found." });

    res.status(200).json({ replies: post.replies || [] });
  } catch (err) {
    console.error("Error fetching forum replies:", err);
    res.status(500).json({ error: "Server error fetching replies" });
  }
};

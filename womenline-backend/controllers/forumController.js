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
      tags: [],
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
    const userId = req.user?.id || null;
    await logAuditTrail(
      "Forum Post Create Error",
      JSON.stringify({ error: err.message }),
      userId
    );
    res.status(500).json({ error: "Server error creating forum post" });
  }
};

// Add a reply to a forum post
exports.addForumReply = async (req, res) => {
  try {
    const { reply } = req.body;
    const postId = req.params.postId;
    const userId = req.user?.id || new mongoose.Types.ObjectId();

if (!reply) {
  logEvent("FORUM_REPLY_FAIL", "Empty reply attempted", userId);
  await logAuditTrail(
    "Forum Reply Failed",
    JSON.stringify({ error: "Empty reply attempted" }),
    userId
  );
  return res.status(400).json({ error: "Comment cannot be empty" }); // ✅ correct
}



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
    const userId = req.user?.id || null;
    await logAuditTrail(
      "Forum Reply Error",
      JSON.stringify({ error: err.message }),
      userId
    );
    res.status(500).json({ error: "Server error adding reply" });
  }
};

// Get all replies for a forum post
exports.getForumReplies = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await ForumPost.findById(postId).lean();

    if (!post) return res.status(404).json({ error: "Forum post not found." });

    const userId = req.user?.id || null;
    logEvent("FETCH_FORUM_REPLIES", `Fetched replies for Post ID ${postId}`, userId);
    await logAuditTrail(
      "Fetch Forum Replies",
      JSON.stringify({ postId, replyCount: post.replies.length }),
      userId
    );

    res.status(200).json({ replies: post.replies || [] });
  } catch (err) {
    console.error("Error fetching forum replies:", err);
    const userId = req.user?.id || null;
    await logAuditTrail(
      "Fetch Forum Replies Error",
      JSON.stringify({ error: err.message }),
      userId
    );
    res.status(500).json({ error: "Server error fetching replies" });
  }
};

// Report a forum post
exports.reportPost = async (req, res) => {
  try {
    const { reason } = req.body;
    const postId = req.params.postId;
    const userId = req.user?.id || new mongoose.Types.ObjectId();

    if (!reason)
      return res.status(400).json({ error: "Report reason is required." });

    const post = await ForumPost.findById(postId);
    if (!post) return res.status(404).json({ error: "Forum post not found." });

    post.reports = post.reports || [];
    post.reports.push({
      userId,
      reason,
      reportedAt: new Date(),
    });

    await post.save();

    logEvent("FORUM_POST_REPORTED", `Post ID ${postId} reported`, userId);
    await logAuditTrail(
      "Forum Post Reported",
      JSON.stringify({ postId, reason }),
      userId
    );

    res.status(200).json({ message: "Post reported successfully." });
  } catch (err) {
    console.error("Error reporting post:", err);
    const userId = req.user?.id || null;
    await logAuditTrail(
      "Forum Post Report Error",
      JSON.stringify({ error: err.message }),
      userId
    );
    res.status(500).json({ error: "Server error reporting post" });
  }
};

// Get all reported posts (Admin only)
exports.getReports = async (req, res) => {
  try {
    const postsWithReports = await ForumPost.find(
      { reports: { $exists: true, $ne: [] } },
      { content: 1, reports: 1, createdAt: 1 }
    )
      .populate("reports.userId", "name email")
      .lean();

    if (!postsWithReports.length) {
      const userId = req.user?.id || "admin";
      logEvent("FETCH_FORUM_REPORTS_EMPTY", "No reports found", userId);
      await logAuditTrail("Fetch Forum Reports", "No reports found", userId);
      return res.status(404).json({ message: "No reports found." });
    }

    const userId = req.user?.id || "admin";
    logEvent(
      "FETCH_FORUM_REPORTS",
      `Fetched ${postsWithReports.length} reports`,
      userId
    );
    await logAuditTrail(
      "Fetch Forum Reports",
      JSON.stringify({ reportCount: postsWithReports.length }),
      userId
    );

    res.status(200).json({ reports: postsWithReports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    const userId = req.user?.id || "admin";
    await logAuditTrail(
      "Fetch Forum Reports Error",
      JSON.stringify({ error: err.message }),
      userId
    );
    res.status(500).json({ error: "Server error fetching reports" });
  }
};

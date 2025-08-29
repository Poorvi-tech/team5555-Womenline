const express = require("express");
const router = express.Router();
const forumController = require("../controllers/forumController");
const { commentModeration } = require("../middleware/abusivecomment");
const { forumSpamFilter } = require("../middleware/forumSpamFilter");
const { protect, rolecheck } = require("../middleware/authMiddleware");

// Create forum post
router.post(
  "/forum-post",
  protect,
  forumSpamFilter,
  forumController.createForumPost
);

// Add reply to a forum post
router.post(
  "/forum-reply/:postId",
  protect,
  forumSpamFilter,
  forumController.addForumReply
);

// Get replies for a forum post
router.get("/forum-replies/:postId", protect, forumController.getForumReplies);

// Report a forum post
router.post("/report-post/:postId", protect, forumController.reportPost);

// Get all reported posts (admin only)
router.get(
  "/reports",
  protect,
  rolecheck(["admin"]),
  forumController.getReports
);

module.exports = router;

const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const commentModeration = require('../middleware/abusivecomment');
const { protect } = require("../middleware/authMiddleware");  // <<-- ADD THIS
const { addForumReply, getForumReplies } = require('../controllers/forumController');
const AuditLog = require('../models/AuditLog'); // Import AuditLog model

// Forum Post Routes
router.post('/forum-post', forumController.createForumPost);

// Add comment moderation middleware to the reply route
router.post('/forum-reply/:postId', protect, commentModeration, async (req, res) => {
  try {
    const reply = await addForumReply(req, res);
    // Log the forum reply action
    await AuditLog.logForumReply(req.user._id, req.params.postId); // Log the reply
    return reply;
  } catch (error) {
    console.error("Error adding forum reply:", error);
    res.status(500).json({ error: "Failed to add reply" });
  }
});

router.get('/forum-replies/:postId', getForumReplies);

module.exports = router;

const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const commentModeration = require('../middleware/abusivecomment');
const { protect } = require("../middleware/authMiddleware");  // <<-- ADD THIS
const forumSpamFilter = require('../middleware/forumSpamFilter'); // <<-- ADD THIS
const { addForumReply, getForumReplies } = require('../controllers/forumController');
// Forum Post Routes
router.post('/forum-post', protect, forumController.createForumPost); // Protect the post route
router.post('/forum-reply/:postId', protect, forumSpamFilter, addForumReply); // Add spam filter middleware
router.get('/forum-replies/:postId', getForumReplies);
module.exports = router;
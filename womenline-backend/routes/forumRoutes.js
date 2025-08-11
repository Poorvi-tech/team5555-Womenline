const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { commentModeration } = require('../middleware/abusivecomment');

const { protect } = require("../middleware/authMiddleware");

// Forum Post Routes
router.post('/forum-post', forumController.createForumPost);
router.post('/forum-reply/:postId', protect, commentModeration, forumController.addForumReply);
router.get('/forum-replies/:postId', forumController.getForumReplies);

module.exports = router;

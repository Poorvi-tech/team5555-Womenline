const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const commentModeration = require('../middleware/abusivecomment');
const { protect } = require("../middleware/authMiddleware");  // <<-- ADD THIS

const { addForumReply, getForumReplies } = require('../controllers/forumController');

// Forum Post Routes
router.post('/forum-post', forumController.createForumPost);
router.post('/forum-reply/:postId', protect, addForumReply); 
router.get('/forum-replies/:postId', getForumReplies);

module.exports = router;

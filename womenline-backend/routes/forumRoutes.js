const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const commentModeration=require('../middleware/abusivecomment')
const { addForumReply, getForumReplies } = require('../controllers/forumController');

// post forum-post 
console.log(commentModeration)
router.post('/forum-post', forumController.createForumPost);
router.post('/forum-reply/:postId', addForumReply);
router.get('/forum-replies/:postId', getForumReplies);

module.exports = router;

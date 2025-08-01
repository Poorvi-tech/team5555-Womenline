const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const commentModeration=require('../middleware/abusivecomment')
// post forum-post 
console.log(commentModeration)
router.post('/forum-post', forumController.createForumPost);

module.exports = router;

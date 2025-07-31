const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');

// post forum-post 
router.post('/forum-post', forumController.createForumPost);

module.exports = router;

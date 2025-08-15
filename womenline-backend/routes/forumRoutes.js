const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { commentModeration } = require('../middleware/abusivecomment');
const { forumSpamFilter } = require('../middleware/forumSpamFilter');
const { protect, rolecheck } = require("../middleware/authMiddleware");


router.post('/forum-post', protect, forumSpamFilter, forumController.createForumPost); 
router.post('/forum-reply/:postId', protect, commentModeration, forumSpamFilter, forumController.addForumReply); 
router.get('/forum-replies/:postId', forumController.getForumReplies);
router.post('/report-post/:postId', protect, forumController.reportPost);
router.get(
  "/reports",
  protect,
  rolecheck(["admin"]), // sirf admin
  forumController.getReports
);


module.exports = router;

const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");
const mongoose = require("mongoose");

// In-memory storage for forum posts
const forumPosts = [];

// Controller to add a reply to a forum post
exports.addForumReply = async (req, res) => {
  const { reply } = req.body;
  const postId = parseInt(req.params.postId);
  const user = req.user?.id || new mongoose.Types.ObjectId("64b9e2e5f8a8e6f123456789");

  const post = forumPosts.find(post => post.id === postId);

  if (!post) {
    return res.status(404).json({ error: 'Forum post not found.' });
  }

  if (!reply) {
    return res.status(400).json({ error: 'Reply content is required.' });
  }

  // Initialize replies array if not exists
  if (!post.replies) post.replies = [];

  const newReply = {
    reply,
    repliedBy: user,
    repliedAt: new Date()
  };

  post.replies.push(newReply);

  await logAuditTrail("Forum Reply Added", JSON.stringify({ postId, reply }), user);
  logEvent("FORUM_REPLY_ADDED", `Reply added to Post ID ${postId}`, user);

  res.status(200).json({ message: "Reply added successfully.", replies: post.replies });
};

// Controller to get all replies for a forum post
exports.getForumReplies = async (req, res) => {
  const postId = parseInt(req.params.postId);
  const post = forumPosts.find(post => post.id === postId);

  if (!post) {
    return res.status(404).json({ error: 'Forum post not found.' });
  }

  res.status(200).json({ replies: post.replies || [] });
};

// Controller to create a new forum post
exports.createForumPost = async (req, res) => {
  const { title, content, postedBy = "anonymous" } = req.body;
  const user = req.user?.id || new mongoose.Types.ObjectId("64b9e2e5f8a8e6f123456789");

  // Validate required fields
  if (!title || !content) {
    logEvent("FORUM_POST_CREATE_FAIL", `Missing title or content`, postedBy);
    await logAuditTrail(
      "Forum Post Failed",
      JSON.stringify({ message: "Missing title or content", postedBy }),
      user
    );
    return res.status(400).json({ error: "Title and content are required." });
  }

  // Construct new forum post object
  const newPost = {
    id: forumPosts.length + 1,
    title,
    content,
    postedBy,
    createdAt: new Date(),
  };

  forumPosts.push(newPost);

  logEvent("FORUM_POST_CREATED", `Forum post created: "${title}"`, postedBy);
  await logAuditTrail(
    "Forum Post Created",
    JSON.stringify({ title, postedBy, createdAt: newPost.createdAt }),
    user
  );

  // Return success response with new post details
  res.status(201).json({ postId: newPost.id, createdAt: newPost.createdAt });
};

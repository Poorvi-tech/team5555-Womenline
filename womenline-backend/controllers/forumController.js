const logEvent = require("../utils/logger");

// In-memory storage for forum posts
const forumPosts = [];

// Controller to create a new forum post
exports.createForumPost = (req, res) => {
  const { title, content, postedBy = "anonymous" } = req.body;

  // Validate required fields
  if (!title || !content) {
    logEvent("FORUM_POST_CREATE_FAIL", `Missing title or content`, postedBy);
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

  // Return success response with new post details
  res.status(201).json({ postId: newPost.id, createdAt: newPost.createdAt });
};

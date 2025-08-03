const logEvent = require("../utils/logger");
const logAuditTrail = require("../utils/logAuditTrail");

// In-memory storage for forum posts
const forumPosts = [];

// Controller to create a new forum post
exports.createForumPost = async (req, res) => {
  const { title, content, postedBy = "anonymous" } = req.body;

  // Validate required fields
  if (!title || !content) {
    logEvent("FORUM_POST_CREATE_FAIL", `Missing title or content`, postedBy);
    await logAuditTrail(
      "Forum Post Failed",
      JSON.stringify({ message: "Missing title or content", postedBy }),
      req.user?.id || "anonymous"
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
    req.user?.id || "anonymous"
  );

  // Return success response with new post details
  res.status(201).json({ postId: newPost.id, createdAt: newPost.createdAt });
};

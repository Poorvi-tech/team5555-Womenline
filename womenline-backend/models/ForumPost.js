const mongoose = require("mongoose");

// Schema for Forum Posts
const forumPostSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Optional for anonymous posts
  },
  content: {
    type: String,
    required: true, // Main post content
  },
  tags: {
    type: [String],
    required: false, // Optional tags for categorization
  },
  createdAt: {
    type: Date,
    default: Date.now, // Auto-set creation timestamp
  },
  replies: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false, // Optional for anonymous replie
      },
      content: {
        type: String,
        required: true, // Reply content
      },
      createdAt: {
        type: Date,
        default: Date.now, // Auto-set reply timestamp
      },
    },
  ],
});

// Index for querying forum posts by tags
forumPostSchema.index({ userId: 1 });

// Mongoose model export
const ForumPost = mongoose.model("ForumPost", forumPostSchema);
module.exports = ForumPost;

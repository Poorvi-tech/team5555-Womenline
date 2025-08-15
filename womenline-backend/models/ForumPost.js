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
  reports: [
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, required: true },
    reportedAt: { type: Date, default: Date.now }
  }
],
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

forumPostSchema.pre('save', async function(next) {
  if (this.userId) {
    const userExists = await mongoose.model('User').exists({ _id: this.userId });
    if (!userExists) {
      throw new Error('Invalid userId for ForumPost');
    }
  }
  next();
});


// Mongoose model export
const ForumPost = mongoose.model("ForumPost", forumPostSchema);
module.exports = ForumPost;

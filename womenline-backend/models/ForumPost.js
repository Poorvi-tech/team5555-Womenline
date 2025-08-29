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
    required: true,
    validate: {
      validator: v => v && v.trim().length > 0,
      message: "Post content cannot be empty"
    }
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
        required: false, // Optional for anonymous replies
      },
      content: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

// Index for querying forum posts by user
forumPostSchema.index({ userId: 1 });
forumPostSchema.index({ createdAt: -1 });

// Validate UserId existence before save
forumPostSchema.pre("save", async function (next) {
  if (this.userId) {
    const userExists = await mongoose.model("User").exists({ _id: this.userId });
    if (!userExists) {
      throw new Error("Invalid userId for ForumPost");
    }
  }
  next();
});

module.exports = mongoose.model("ForumPost", forumPostSchema);

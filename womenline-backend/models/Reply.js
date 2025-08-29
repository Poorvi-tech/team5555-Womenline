const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  forumId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for performance
replySchema.index({ forumId: 1 });

module.exports = mongoose.model('Reply', replySchema);

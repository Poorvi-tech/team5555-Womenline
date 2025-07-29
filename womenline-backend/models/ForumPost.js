const mongoose = require('mongoose');

const forumPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for anonymous posts
    },
    content: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    replies: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false
        },
        content: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
});

// Index for querying forum posts by tags
forumPostSchema.index({ tags: 1 });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
module.exports = ForumPost;
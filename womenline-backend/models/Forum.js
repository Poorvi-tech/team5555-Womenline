const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    replies: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Reply' 
    }]
});

module.exports = mongoose.model('Forum', forumSchema);

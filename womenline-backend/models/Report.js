const mongoose = require('mongoose');
 const  Reports = new mongoose.Schema({
      reportedBy: {
            type: String,
            required: true,
          },
           postId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "ForumPost", 
          },
          reason: {
            type: String,
            required: true, 
          }       
 },
{ timestamps: true }
);


module.exports = mongoose.model('Reports', Reports);
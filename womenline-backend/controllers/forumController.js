const forumPosts = [];

exports.createForumPost = (req, res) => {
  const { title, content, postedBy = 'anonymous' } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }
// body//
  const newPost = {
    id: forumPosts.length + 1,
    title,
    content,
    postedBy,
    createdAt: new Date()
  };

  forumPosts.push(newPost);
  res.status(201).json({ postId: newPost.id, createdAt: newPost.createdAt });
};

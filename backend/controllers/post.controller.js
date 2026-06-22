import Post from '../models/Post.js';

const AUTHOR_FIELDS = 'name profilePicture';

// GET /api/posts — public. Newest first, author name populated.
export const listPosts = async (req, res) => {
  res.json(await Post.find().sort({ createdAt: -1 }).populate('authorId', AUTHOR_FIELDS));
};

// GET /api/posts/:id — public
export const getPost = async (req, res) => {
  const post = await Post.findById(req.params.id).populate('authorId', AUTHOR_FIELDS);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
};

// POST /api/posts — private. Returns the post with the author populated.
export const createPost = async (req, res) => {
  const post = await Post.create({ ...req.body, authorId: req.user.id });
  await post.populate('authorId', AUTHOR_FIELDS);
  res.status(201).json(post);
};

// PUT /api/posts/:id — private, author only.
export const updatePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId?.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to modify this post' });
  }
  delete req.body.authorId;
  const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('authorId', AUTHOR_FIELDS);
  res.json(updated);
};

// DELETE /api/posts/:id — private, author only.
export const deletePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  if (post.authorId?.toString() !== req.user.id) {
    return res.status(403).json({ error: 'Not authorized to delete this post' });
  }
  await post.deleteOne();
  res.json({ message: 'Post deleted successfully' });
};

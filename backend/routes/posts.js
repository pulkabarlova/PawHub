import express from 'express';
const router = express.Router();
import Post from '../models/Post.js';
import auth from '../middleware/auth.js';

// GET all
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find();
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET one by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST new post
router.post('/', auth, async (req, res) => {
    try {
        const postData = { ...req.body, authorId: req.user.id };
        const post = await Post.create(postData);
        res.status(201).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// PUT/PATCH update post
router.put('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json(post);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;

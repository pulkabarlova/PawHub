import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Generate JWT Helper
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_key_123', {
    expiresIn: '30d'
  });
};

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'owner',
      profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   POST /api/users/login
// @desc    Authenticate a user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      token: generateToken(user._id, user.role)
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// @route   GET /api/users/me
// @desc    Get current logged in user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all users (Admin/Testing)
router.get('/', async (req, res) => {
    try {
        const users = await User.find().select('-passwordHash');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET one by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT/PATCH update user
router.put('/:id', auth, async (req, res) => {
    try {
        // Prevent users from updating other users unless admin (simplified: only self)
        if (req.user.id !== req.params.id) {
           return res.status(403).json({ error: 'Not authorized to update this user' });
        }
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { 
            new: true, 
            runValidators: true 
        }).select('-passwordHash');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
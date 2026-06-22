import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret_key_123', { expiresIn: '30d' });

const publicUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profilePicture: user.profilePicture,
});

// POST /api/users/register — public
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (await User.findOne({ email })) {
    return res.status(400).json({ error: 'User already exists' });
  }

  const passwordHash = await bcrypt.hash(password, await bcrypt.genSalt(10));
  const user = await User.create({
    name,
    email,
    passwordHash,
    role: role || 'owner',
    profilePicture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
  });

  res.status(201).json({ ...publicUser(user), token: generateToken(user._id, user.role) });
};

// POST /api/users/login — public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(400).json({ error: 'Invalid credentials' });
  }

  res.json({ ...publicUser(user), token: generateToken(user._id, user.role) });
};

// GET /api/users/me — private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user.id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

// GET /api/users — public
export const listUsers = async (req, res) => {
  res.json(await User.find().select('-passwordHash'));
};

// GET /api/users/:id — public
export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

// PUT /api/users/:id — private (self only)
export const updateUser = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(403).json({ error: 'Not authorized to update this user' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).select('-passwordHash');
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

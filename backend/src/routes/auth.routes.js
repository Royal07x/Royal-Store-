import express from 'express';
import User from '../models/User.js';
import { signAccessToken } from '../utils/jwt.js';

const router = express.Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/signup', async (req, res, next) => {
  try {
    const name = String(req.body.name ?? '').trim();
    const email = String(req.body.email ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');

    if (name.length < 2 || name.length > 80 || !emailPattern.test(email) || password.length < 8 || password.length > 128) {
      return res.status(400).json({ success: false, message: 'Enter a valid name, email, and password (8–128 characters).' });
    }

    const exists = await User.exists({ email });
    if (exists) return res.status(409).json({ success: false, message: 'An account with this email already exists.' });

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });
    const token = signAccessToken(user);

    return res.status(201).json({
      success: true,
      data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } },
    });
  } catch (error) {
    return next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = String(req.body.email ?? '').trim().toLowerCase();
    const password = String(req.body.password ?? '');
    if (!emailPattern.test(email) || !password) return res.status(400).json({ success: false, message: 'Email and password are required.' });

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user || !user.isActive || !(await user.verifyPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = signAccessToken(user);
    return res.json({ success: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
  } catch (error) {
    return next(error);
  }
});

export default router;

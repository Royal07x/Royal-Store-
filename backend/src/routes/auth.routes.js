import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const r = express.Router();
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const authLimit = rateLimit({ windowMs: 15 * 60_000, max: 10 });
const token = (u) => jwt.sign({ sub: u._id.toString(), role: u.role }, process.env.JWT_SECRET, { expiresIn: '15m', issuer: 'royal-store-v2' });

r.post('/signup', authLimit, async (q, s, n) => {
  try {
    const name = String(q.body?.name ?? '').trim(), e = String(q.body?.email ?? '').trim().toLowerCase(), p = String(q.body?.password ?? '');
    if (name.length < 2 || name.length > 80 || !email.test(e) || p.length < 8 || p.length > 128) return s.status(400).json({ success: false, message: 'Enter a valid name, email, and password (8–128 characters).' });
    if (await User.exists({ email: e })) return s.status(409).json({ success: false, message: 'An account with this email already exists.' });
    const u = await User.create({ name, email: e, passwordHash: await bcrypt.hash(p, 12) });
    s.status(201).json({ success: true, data: { token: token(u), user: { id: u._id, name: u.name, email: u.email, role: u.role } } });
  } catch (x) { n(x); }
});

r.post('/login', authLimit, async (q, s, n) => {
  try {
    const e = String(q.body?.email ?? '').trim().toLowerCase(), p = String(q.body?.password ?? '');
    if (!email.test(e) || !p || p.length > 128) return s.status(400).json({ success: false, message: 'Email and password are required.' });
    const u = await User.findOne({ email: e }).select('+passwordHash');
    if (!u || !u.isActive || !(await bcrypt.compare(p, u.passwordHash))) return s.status(401).json({ success: false, message: 'Invalid email or password.' });
    s.json({ success: true, data: { token: token(u), user: { id: u._id, name: u.name, email: u.email, role: u.role } } });
  } catch (x) { n(x); }
});

r.get('/me', requireAuth, (q, s) => s.json({ success: true, data: { user: { id: q.user._id, name: q.user.name, email: q.user.email, role: q.user.role } } }));
export default r;

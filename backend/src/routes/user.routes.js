import express from 'express';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/me', requireAuth, (req, res) => {
  res.json({ success: true, data: { user: { id: req.user._id, name: req.user.name, email: req.user.email, role: req.user.role } } });
});

export default router;

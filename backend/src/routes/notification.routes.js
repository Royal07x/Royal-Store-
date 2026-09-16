import { Router } from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100).lean();
    res.json({ success: true, notifications });
  } catch (error) { next(error); }
});

router.patch('/:id/read', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid notification ID.' });
    const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { read: true }, { new: true }).lean();
    if (!notification) return res.status(404).json({ success: false, message: 'Notification not found.' });
    res.json({ success: true, notification });
  } catch (error) { next(error); }
});

export default router;

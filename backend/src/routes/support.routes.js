import { Router } from 'express';
import mongoose from 'mongoose';
import SupportTicket from '../models/SupportTicket.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();
router.use(requireAuth);
const ticketLimit = rateLimit({ windowMs: 60_000, max: 5 });

router.post('/', ticketLimit, async (req, res, next) => {
  try {
    const { subject, message } = req.body || {};
    if (typeof subject !== 'string' || subject.trim().length < 3 || subject.trim().length > 160 || typeof message !== 'string' || message.trim().length < 5 || message.trim().length > 2000) {
      return res.status(400).json({ success: false, message: 'Valid subject and message are required.' });
    }
    const ticket = await SupportTicket.create({ user: req.user._id, subject: subject.trim(), message: message.trim() });
    res.status(201).json({ success: true, ticket });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try { res.json({ success: true, tickets: await SupportTicket.find({ user: req.user._id }).sort({ createdAt: -1 }).lean() }); }
  catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ success: false, message: 'Invalid ticket ID.' });
    const ticket = await SupportTicket.findOne({ _id: req.params.id, user: req.user._id }).lean();
    if (!ticket) return res.status(404).json({ success: false, message: 'Support ticket not found.' });
    res.json({ success: true, ticket });
  } catch (error) { next(error); }
});

export default router;

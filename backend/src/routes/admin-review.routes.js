import { Router } from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/', async (_req, res, next) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(200).populate('user', 'name email').populate('product', 'name sku').lean();
    res.json({ success: true, reviews });
  } catch (error) { next(error); }
});

router.patch('/:reviewId', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.reviewId)) return res.status(400).json({ success: false, message: 'Invalid review ID.' });
    const { status, adminNote } = req.body || {};
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Review can only be approved or rejected.' });
    const review = await Review.findById(req.params.reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found.' });
    review.status = status;
    review.adminNote = typeof adminNote === 'string' ? adminNote.trim().slice(0, 1000) : '';
    await review.save();
    res.json({ success: true, review });
  } catch (error) { next(error); }
});

export default router;

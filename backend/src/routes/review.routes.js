import { Router } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();
const reviewLimit = rateLimit({ windowMs: 60_000, max: 5 });

router.get('/product/:productId', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.productId)) return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    const reviews = await Review.find({ product: req.params.productId, status: 'approved' }).sort({ createdAt: -1 }).populate('user', 'name').lean();
    res.json({ success: true, reviews: reviews.map(({ user, _id, product, rating, comment, createdAt }) => ({ id: _id, product, rating, comment, userName: user?.name || 'Customer', createdAt })) });
  } catch (error) { next(error); }
});

router.post('/', requireAuth, reviewLimit, async (req, res, next) => {
  try {
    const { productId, orderId, rating, comment } = req.body || {};
    if (!mongoose.Types.ObjectId.isValid(productId) || !mongoose.Types.ObjectId.isValid(orderId)) return res.status(400).json({ success: false, message: 'Valid product and order IDs are required.' });
    const score = Number(rating);
    if (!Number.isInteger(score) || score < 1 || score > 5) return res.status(400).json({ success: false, message: 'Rating must be an integer from 1 to 5.' });
    if (typeof comment !== 'string' || comment.trim().length < 3 || comment.trim().length > 1000) return res.status(400).json({ success: false, message: 'Review must be 3–1000 characters.' });
    const product = await Product.findOne({ _id: productId, active: true }).select('_id').lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    const order = await Order.findOne({ _id: orderId, user: req.user._id, status: 'delivered', paymentStatus: 'paid' }).select('items').lean();
    if (!order || !order.items.some((item) => item.product.toString() === productId)) return res.status(403).json({ success: false, message: 'You can review a product only from your own delivered, paid order.' });
    const existing = await Review.findOne({ product: productId, user: req.user._id });
    if (existing) return res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
    const review = await Review.create({ product: productId, user: req.user._id, order: orderId, rating: score, comment: comment.trim() });
    res.status(201).json({ success: true, review });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'You have already reviewed this product.' });
    next(error);
  }
});

router.get('/mine', requireAuth, async (req, res, next) => {
  try { res.json({ success: true, reviews: await Review.find({ user: req.user._id }).sort({ createdAt: -1 }).lean() }); }
  catch (error) { next(error); }
});

export default router;

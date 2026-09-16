import { Router } from 'express';
import Order from '../models/Order.js';
import ReturnRequest from '../models/ReturnRequest.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();
const returnLimit = rateLimit({ windowMs: 60_000, max: 8 });
router.use(requireAuth);

router.post('/', returnLimit, async (req, res, next) => {
  try {
    const { orderId, reason } = req.body || {};
    if (!orderId || typeof reason !== 'string' || reason.trim().length < 5 || reason.trim().length > 1000) {
      return res.status(400).json({ success: false, message: 'A valid order ID and return reason are required.' });
    }
    const order = await Order.findOne({ _id: orderId, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.status !== 'delivered' || order.paymentStatus !== 'paid') {
      return res.status(409).json({ success: false, message: 'Only delivered, paid orders can request a return.' });
    }
    const existing = await ReturnRequest.findOne({ order: order._id });
    if (existing) return res.status(409).json({ success: false, message: 'A return request already exists for this order.' });
    const request = await ReturnRequest.create({ order: order._id, user: req.user._id, reason: reason.trim() });
    return res.status(201).json({ success: true, data: { returnRequest: request } });
  } catch (error) { next(error); }
});

router.get('/', async (req, res, next) => {
  try {
    const requests = await ReturnRequest.find({ user: req.user._id }).sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: { returnRequests: requests } });
  } catch (error) { next(error); }
});

export default router;

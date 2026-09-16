import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { collectHealth } from '../services/health.service.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/dashboard', async (_req, res, next) => {
  try {
    const [users, activeProducts, orders, paidPayments, recentOrders, customers] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments({ active: true }),
      Order.countDocuments(),
      Payment.find({ status: 'paid' }).select('amount').lean(),
      Order.find().sort({ createdAt: -1 }).limit(10).select('_id user total status createdAt').lean(),
      User.find().sort({ createdAt: -1 }).limit(20).select('_id name email role isActive createdAt').lean(),
    ]);
    const revenuePaise = paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    res.json({ success: true, metrics: { users, activeProducts, orders, paidPayments: paidPayments.length, revenuePaise }, recentOrders, customers });
  } catch (error) { next(error); }
});

router.get('/orders', async (_req, res, next) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name email').lean();
    res.json({ success: true, orders });
  } catch (error) { next(error); }
});

router.get('/customers', async (_req, res, next) => {
  try {
    const customers = await User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(100).select('_id name email isActive createdAt').lean();
    res.json({ success: true, customers });
  } catch (error) { next(error); }
});

router.get('/health', (_req, res) => {
  const health = collectHealth();
  res.status(health.status === 'ok' ? 200 : 503).json({ success: true, health });
});

router.patch('/orders/:orderId/status', async (req, res, next) => {
  try {
    const allowed = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    const { status } = req.body || {};
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid order status.' });
    const order = await Order.findByIdAndUpdate(req.params.orderId, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    res.json({ success: true, order });
  } catch (error) { next(error); }
});

export default router;

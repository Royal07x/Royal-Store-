import { Router } from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import ReturnRequest from '../models/ReturnRequest.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { collectHealth } from '../services/health.service.js';
import { createRefund } from '../utils/razorpay.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

router.get('/dashboard', async (_req, res, next) => {
  try {
    const [users, activeProducts, orders, paidPayments, recentOrders, customers] = await Promise.all([
      User.countDocuments(), Product.countDocuments({ active: true }), Order.countDocuments(),
      Payment.find({ status: 'paid' }).select('amount').lean(),
      Order.find().sort({ createdAt: -1 }).limit(10).select('_id user total status createdAt').lean(),
      User.find().sort({ createdAt: -1 }).limit(20).select('_id name email role isActive createdAt').lean()
    ]);
    const revenuePaise = paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    res.json({ success: true, metrics: { users, activeProducts, orders, paidPayments: paidPayments.length, revenuePaise }, recentOrders, customers });
  } catch (error) { next(error); }
});

router.get('/orders', async (_req, res, next) => {
  try { res.json({ success: true, orders: await Order.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name email').lean() }); }
  catch (error) { next(error); }
});

router.get('/customers', async (_req, res, next) => {
  try { res.json({ success: true, customers: await User.find({ role: 'customer' }).sort({ createdAt: -1 }).limit(100).select('_id name email isActive createdAt').lean() }); }
  catch (error) { next(error); }
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

router.get('/returns', async (_req, res, next) => {
  try {
    const requests = await ReturnRequest.find().sort({ createdAt: -1 }).limit(100).populate('user', 'name email').populate('order', 'orderNumber total status paymentStatus').lean();
    res.json({ success: true, requests });
  } catch (error) { next(error); }
});

router.patch('/returns/:returnId', async (req, res, next) => {
  try {
    const { status, adminNote } = req.body || {};
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ success: false, message: 'Return can only be approved or rejected here.' });
    const request = await ReturnRequest.findById(req.params.returnId);
    if (!request) return res.status(404).json({ success: false, message: 'Return request not found.' });
    if (request.status !== 'requested') return res.status(409).json({ success: false, message: 'This return request has already been reviewed.' });
    request.status = status;
    request.adminNote = typeof adminNote === 'string' ? adminNote.trim().slice(0, 1000) : '';
    await request.save();
    res.json({ success: true, data: { returnRequest: request } });
  } catch (error) { next(error); }
});

router.post('/returns/:returnId/refund', async (req, res, next) => {
  try {
    const request = await ReturnRequest.findById(req.params.returnId);
    if (!request) return res.status(404).json({ success: false, message: 'Return request not found.' });
    if (request.status !== 'approved') return res.status(409).json({ success: false, message: 'Only an approved return can be refunded.' });
    if (request.refundId) return res.status(409).json({ success: false, message: 'Refund has already been processed.' });
    const payment = await Payment.findOne({ order: request.order, status: 'paid' });
    if (!payment?.gatewayPaymentId) return res.status(409).json({ success: false, message: 'A captured gateway payment is required before refund.' });
    const refund = await createRefund(payment.gatewayPaymentId, payment.amount);
    payment.status = 'refunded';
    await payment.save();
    request.status = 'refunded';
    request.refundId = refund.id || '';
    request.refundedAt = new Date();
    await request.save();
    await Order.updateOne({ _id: request.order }, { $set: { status: 'refunded', paymentStatus: 'refunded' } });
    res.json({ success: true, data: { returnRequest: request, refund: { id: refund.id, status: refund.status, amount: refund.amount } } });
  } catch (error) { next(error); }
});

export default router;

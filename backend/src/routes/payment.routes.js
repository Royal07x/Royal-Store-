import express from 'express';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { env } from '../config/env.js';
import { createRazorpayOrder, createDynamicQr, fetchQr, fetchPayment, verifyPaymentSignature, verifyWebhookSignature } from '../utils/razorpay.js';
import { notifyPaymentPaid, notifyPaymentFailed } from '../services/notification.service.js';

const router = express.Router();
const paymentLimit = rateLimit({ windowMs: 60_000, max: 12 });
const toPaise = (rupees) => Math.round(Number(rupees) * 100);
const publicPayment = (payment) => ({ id: payment._id, order: payment.order, amount: payment.amount, currency: payment.currency, status: payment.status, gatewayOrderId: payment.gatewayOrderId, gatewayQrId: payment.gatewayQrId, qrImageUrl: payment.qrImageUrl, qrCloseBy: payment.qrCloseBy, attempt: payment.attempt });

router.post('/orders/:orderId/create', requireAuth, paymentLimit, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.status === 'cancelled' || order.paymentStatus === 'paid') return res.status(409).json({ success: false, message: order.status === 'cancelled' ? 'Cancelled orders cannot be paid.' : 'Order is already paid.' });
    const latest = await Payment.findOne({ order: order._id }).sort({ attempt: -1 });
    const attempt = (latest?.attempt ?? 0) + 1;
    const amount = toPaise(order.total);
    const gatewayOrder = await createRazorpayOrder({ amount, receipt: order.orderNumber });
    const payment = await Payment.create({ order: order._id, user: req.user._id, gatewayOrderId: gatewayOrder.id, amount, currency: 'INR', status: 'pending', attempt });
    return res.status(201).json({ success: true, data: { payment: publicPayment(payment), razorpayKeyId: env.RAZORPAY_KEY_ID } });
  } catch (e) { next(e); }
});

router.post('/orders/:orderId/qr', requireAuth, paymentLimit, async (req, res, next) => {
  try {
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.status === 'cancelled' || order.paymentStatus === 'paid') return res.status(409).json({ success: false, message: order.status === 'cancelled' ? 'Cancelled orders cannot be paid.' : 'Order is already paid.' });
    const latest = await Payment.findOne({ order: order._id }).sort({ attempt: -1 });
    const attempt = (latest?.attempt ?? 0) + 1;
    const qr = await createDynamicQr({ amount: toPaise(order.total), description: `Royal Store order ${order.orderNumber}`, closeBy: Math.floor(Date.now() / 1000) + 120 });
    const payment = await Payment.create({ order: order._id, user: req.user._id, gatewayQrId: qr.id, amount: toPaise(order.total), currency: 'INR', status: 'pending', attempt, qrImageUrl: qr.image_url || '', qrCloseBy: qr.close_by ? new Date(qr.close_by * 1000) : null });
    return res.status(201).json({ success: true, data: { payment: publicPayment(payment) } });
  } catch (e) { next(e); }
});

router.post('/verify', requireAuth, paymentLimit, async (req, res, next) => {
  try {
    const { paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body || {};
    const payment = await Payment.findOne({ _id: paymentId, user: req.user._id });
    if (!payment || !payment.gatewayOrderId) return res.status(404).json({ success: false, message: 'Payment attempt not found.' });
    if (payment.status === 'paid') return res.json({ success: true, data: { payment: publicPayment(payment) } });
    if (razorpayOrderId !== payment.gatewayOrderId) return res.status(400).json({ success: false, message: 'Payment order verification failed.' });
    if (!verifyPaymentSignature({ orderId: payment.gatewayOrderId, paymentId: razorpayPaymentId, signature: razorpaySignature })) return res.status(400).json({ success: false, message: 'Payment signature verification failed.' });
    const gatewayPayment = await fetchPayment(razorpayPaymentId);
    if (gatewayPayment.order_id !== payment.gatewayOrderId || Number(gatewayPayment.amount) !== payment.amount || gatewayPayment.status !== 'captured') return res.status(400).json({ success: false, message: 'Payment is not captured by Razorpay.' });
    payment.gatewayPaymentId = razorpayPaymentId; payment.status = 'paid'; payment.paidAt = new Date(); await payment.save();
    const order = await Order.findOneAndUpdate({ _id: payment.order, user: req.user._id }, { $set: { paymentStatus: 'paid', status: 'confirmed' } }, { new: true });
    if (order) await notifyPaymentPaid(order);
    return res.json({ success: true, data: { payment: publicPayment(payment) } });
  } catch (e) { next(e); }
});

router.get('/:paymentId', requireAuth, async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.paymentId, user: req.user._id });
    if (!payment) return res.status(404).json({ success: false, message: 'Payment not found.' });
    if (payment.gatewayQrId && payment.status === 'pending') { const qr = await fetchQr(payment.gatewayQrId); if (qr.status === 'closed') { payment.status = 'expired'; await payment.save(); } }
    return res.json({ success: true, data: { payment: publicPayment(payment) } });
  } catch (e) { next(e); }
});

router.post('/webhook', async (req, res, next) => {
  try {
    const signature = req.get('x-razorpay-signature');
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
    if (!signature || !verifyWebhookSignature(rawBody, signature)) return res.status(400).json({ success: false, message: 'Invalid webhook signature.' });
    const payload = JSON.parse(rawBody.toString('utf8'));
    const event = payload.event, pe = payload.payload?.payment?.entity, qe = payload.payload?.qr_code?.entity;
    if (event === 'qr_code.credited' && pe && qe) {
      const payment = await Payment.findOne({ gatewayQrId: qe.id });
      if (payment && payment.status !== 'paid' && Number(pe.amount) === payment.amount) {
        payment.gatewayPaymentId = pe.id; payment.status = 'paid'; payment.paidAt = new Date(); await payment.save();
        const order = await Order.findByIdAndUpdate(payment.order, { $set: { paymentStatus: 'paid', status: 'confirmed' } }, { new: true });
        if (order) await notifyPaymentPaid(order);
      }
    }
    if (event === 'payment.captured' && pe?.order_id) {
      const payment = await Payment.findOne({ gatewayOrderId: pe.order_id });
      if (payment && payment.status !== 'paid' && Number(pe.amount) === payment.amount) {
        payment.gatewayPaymentId = pe.id; payment.status = 'paid'; payment.paidAt = new Date(); await payment.save();
        const order = await Order.findByIdAndUpdate(payment.order, { $set: { paymentStatus: 'paid', status: 'confirmed' } }, { new: true });
        if (order) await notifyPaymentPaid(order);
      }
    }
    if (event === 'payment.failed' && pe?.order_id) {
      const payment = await Payment.findOneAndUpdate({ gatewayOrderId: pe.order_id, status: { $ne: 'paid' } }, { $set: { status: 'failed', failureReason: pe.error_description || 'Payment failed.' } }, { new: true });
      if (payment) { const order = await Order.findById(payment.order); if (order) await notifyPaymentFailed(order); }
    }
    return res.json({ success: true });
  } catch (e) { next(e); }
});

export default router;

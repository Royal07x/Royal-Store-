import { Router } from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import ReturnRequest from '../models/ReturnRequest.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { collectHealth } from '../services/health.service.js';
import { createRefund } from '../utils/razorpay.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

const productFields = ['sku', 'category', 'name', 'slug', 'description', 'price', 'stock', 'images', 'active'];
const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);
const normalizeProduct = (body = {}) => {
  const product = {};
  for (const field of productFields) if (body[field] !== undefined) product[field] = body[field];
  if (product.sku !== undefined) product.sku = String(product.sku).trim().toUpperCase();
  if (product.category !== undefined) product.category = String(product.category).trim().toLowerCase();
  if (product.name !== undefined) product.name = String(product.name).trim();
  if (product.slug !== undefined) product.slug = String(product.slug).trim().toLowerCase();
  if (product.description !== undefined) product.description = String(product.description).trim();
  if (product.price !== undefined) product.price = Number(product.price);
  if (product.stock !== undefined) product.stock = Number(product.stock);
  if (product.images !== undefined) product.images = Array.isArray(product.images) ? product.images.map(String).map((x) => x.trim()).filter(Boolean).slice(0, 8) : [];
  if (product.active !== undefined) product.active = Boolean(product.active);
  return product;
};
const validateProduct = async (product, { partial = false } = {}) => {
  const required = ['sku', 'category', 'name', 'slug', 'description', 'price', 'stock'];
  if (!partial && required.some((field) => product[field] === undefined || product[field] === '')) return 'sku, category, name, slug, description, price and stock are required.';
  if (product.price !== undefined && (!Number.isFinite(product.price) || product.price < 0)) return 'Price must be a non-negative number.';
  if (product.stock !== undefined && (!Number.isInteger(product.stock) || product.stock < 0)) return 'Stock must be a non-negative integer.';
  if (product.name !== undefined && (product.name.length < 2 || product.name.length > 160)) return 'Product name must be 2–160 characters.';
  if (product.description !== undefined && product.description.length > 2000) return 'Description is too long.';
  if (product.sku !== undefined && !/^[A-Z0-9_-]{2,80}$/.test(product.sku)) return 'SKU contains invalid characters.';
  if (product.slug !== undefined && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) return 'Slug must use lowercase letters, numbers and hyphens.';
  if (product.category !== undefined) {
    const category = await Category.findOne({ slug: product.category, active: true }).select('_id').lean();
    if (!category) return 'Category must be one of the active approved categories.';
  }
  return null;
};

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

router.get('/products', async (_req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).limit(200).lean();
    res.json({ success: true, products });
  } catch (error) { next(error); }
});

router.post('/products', async (req, res, next) => {
  try {
    const product = normalizeProduct(req.body);
    const validationError = await validateProduct(product);
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    const created = await Product.create(product);
    res.status(201).json({ success: true, product: created });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'SKU or slug already exists.' });
    next(error);
  }
});

router.patch('/products/:productId', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.productId)) return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    const product = normalizeProduct(req.body);
    const validationError = await validateProduct(product, { partial: true });
    if (validationError) return res.status(400).json({ success: false, message: validationError });
    const updated = await Product.findByIdAndUpdate(req.params.productId, product, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product: updated });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'SKU or slug already exists.' });
    next(error);
  }
});

router.delete('/products/:productId', async (req, res, next) => {
  try {
    if (!isObjectId(req.params.productId)) return res.status(400).json({ success: false, message: 'Invalid product ID.' });
    const product = await Product.findByIdAndUpdate(req.params.productId, { active: false }, { new: true }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deactivated.', product });
  } catch (error) { next(error); }
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

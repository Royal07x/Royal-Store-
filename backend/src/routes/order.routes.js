import express from 'express';
import crypto from 'node:crypto';
import Cart from '../models/Cart.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireAuth } from '../middleware/auth.js';

const r = express.Router();
r.use(requireAuth);

r.post('/', async (q, s, n) => {
  try {
    const a = q.body?.shippingAddress;
    if (!a?.fullName || !a?.phone || !a?.line1 || !a?.city || !a?.state || !a?.postalCode) return s.status(400).json({ success: false, message: 'Complete shipping address is required.' });
    const c = await Cart.findOne({ user: q.user._id });
    if (!c?.items.length) return s.status(400).json({ success: false, message: 'Cart is empty.' });
    const ps = await Product.find({ _id: { $in: c.items.map((x) => x.product) }, active: true });
    const m = new Map(ps.map((p) => [p._id.toString(), p]));
    const items = [];
    let subtotal = 0;
    for (const ci of c.items) {
      const p = m.get(ci.product.toString());
      if (!p || ci.quantity > p.stock) return s.status(409).json({ success: false, message: 'A cart item is unavailable or has insufficient stock.' });
      const line = p.price * ci.quantity;
      subtotal += line;
      items.push({ product: p._id, sku: p.sku, name: p.name, unitPrice: p.price, quantity: ci.quantity, lineTotal: line });
    }
    const fee = subtotal >= 999 ? 0 : 49;
    const o = await Order.create({ orderNumber: `RS-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`, user: q.user._id, items, shippingAddress: a, subtotal, discount: 0, shippingFee: fee, total: subtotal + fee });
    s.status(201).json({ success: true, data: { order: o } });
  } catch (e) { n(e); }
});

r.get('/', async (q, s, n) => {
  try { s.json({ success: true, data: { orders: await Order.find({ user: q.user._id }).sort({ createdAt: -1 }) } }); }
  catch (e) { n(e); }
});

r.get('/:id', async (q, s, n) => {
  try {
    const o = await Order.findOne({ _id: q.params.id, user: q.user._id });
    if (!o) return s.status(404).json({ success: false, message: 'Order not found.' });
    s.json({ success: true, data: { order: o } });
  } catch (e) { n(e); }
});

r.post('/:id/cancel', async (q, s, n) => {
  try {
    const o = await Order.findOne({ _id: q.params.id, user: q.user._id });
    if (!o) return s.status(404).json({ success: false, message: 'Order not found.' });
    if (o.paymentStatus === 'paid') return s.status(409).json({ success: false, message: 'Paid orders require the refund/return flow and cannot be cancelled here.' });
    if (o.status !== 'pending') return s.status(409).json({ success: false, message: 'This order can no longer be cancelled at this stage.' });
    o.status = 'cancelled';
    await o.save();
    s.json({ success: true, data: { order: o } });
  } catch (e) { n(e); }
});

export default r;

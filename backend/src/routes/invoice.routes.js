import { Router } from 'express';
import crypto from 'node:crypto';
import mongoose from 'mongoose';
import Invoice from '../models/Invoice.js';
import Order from '../models/Order.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const invoiceNumber = () => `RS-INV-${Date.now()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

router.get('/:orderId', async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.orderId)) return res.status(400).json({ success: false, message: 'Invalid order ID.' });
    const order = await Order.findOne({ _id: req.params.orderId, user: req.user._id }).lean();
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (order.status === 'cancelled') return res.status(409).json({ success: false, message: 'Cancelled orders do not have an active receipt.' });

    let invoice = await Invoice.findOne({ order: order._id }).lean();
    if (!invoice) {
      try {
        invoice = await Invoice.create({
          order: order._id,
          user: req.user._id,
          invoiceNumber: invoiceNumber(),
          documentType: order.paymentStatus === 'paid' ? 'invoice' : 'receipt',
          currency: order.currency,
          paymentMethod: order.paymentMethod,
          paymentStatus: order.paymentStatus,
          items: order.items.map(({ sku, name, unitPrice, quantity, lineTotal }) => ({ sku, name, unitPrice, quantity, lineTotal })),
          shippingAddress: order.shippingAddress,
          subtotal: order.subtotal,
          discount: order.discount,
          shippingFee: order.shippingFee,
          total: order.total
        });
        invoice = invoice.toObject();
      } catch (error) {
        if (error?.code !== 11000) throw error;
        invoice = await Invoice.findOne({ order: order._id }).lean();
      }
    }

    res.json({ success: true, invoice, order });
  } catch (error) { next(error); }
});

export default router;

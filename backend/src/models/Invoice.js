import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0 },
  shippingFee: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  issuedAt: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Invoice', schema);

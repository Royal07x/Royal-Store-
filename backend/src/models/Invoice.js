import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
  fullName: { type: String, required: true, maxlength: 100 },
  phone: { type: String, required: true, maxlength: 20 },
  line1: { type: String, required: true, maxlength: 160 },
  line2: { type: String, maxlength: 160, default: '' },
  city: { type: String, required: true, maxlength: 80 },
  state: { type: String, required: true, maxlength: 80 },
  postalCode: { type: String, required: true, maxlength: 12 },
  country: { type: String, default: 'India', maxlength: 60 }
}, { _id: false });

const itemSchema = new mongoose.Schema({
  sku: { type: String, required: true, maxlength: 80 },
  name: { type: String, required: true, maxlength: 160 },
  unitPrice: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1, max: 99 },
  lineTotal: { type: Number, required: true, min: 0 }
}, { _id: false });

const schema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  documentType: { type: String, enum: ['receipt', 'invoice'], default: 'receipt', index: true },
  currency: { type: String, enum: ['INR'], default: 'INR' },
  paymentMethod: { type: String, enum: ['cod', 'razorpay'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  items: { type: [itemSchema], required: true, validate: v => v.length > 0 },
  shippingAddress: { type: addressSchema, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  discount: { type: Number, required: true, min: 0 },
  shippingFee: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  issuedAt: { type: Date, required: true, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Invoice', schema);

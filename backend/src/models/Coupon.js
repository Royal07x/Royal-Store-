import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, minlength: 3, maxlength: 40 },
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  minSubtotal: { type: Number, min: 0, default: 0 },
  maxDiscount: { type: Number, min: 0, default: null },
  usageLimit: { type: Number, min: 1, default: null },
  usedCount: { type: Number, min: 0, default: 0 },
  startsAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true, versionKey: false });

couponSchema.index({ active: 1, startsAt: 1, expiresAt: 1 });

export default mongoose.model('Coupon', couponSchema);

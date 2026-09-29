import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true, minlength: 3, maxlength: 40, match: /^[A-Z0-9_-]{3,40}$/ },
  type: { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0.01 },
  minSubtotal: { type: Number, min: 0, default: 0 },
  maxDiscount: { type: Number, min: 0.01, default: null },
  usageLimit: { type: Number, min: 1, default: null },
  usedCount: { type: Number, min: 0, default: 0 },
  startsAt: { type: Date, default: null },
  expiresAt: { type: Date, default: null },
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true, versionKey: false });

couponSchema.index({ active: 1, startsAt: 1, expiresAt: 1 });

couponSchema.pre('validate', function(next) {
  if (this.type === 'percent' && this.value > 100) return next(new Error('Percent coupon value cannot exceed 100.'));
  if (this.type === 'fixed' && this.maxDiscount != null) return next(new Error('Maximum discount is only valid for percent coupons.'));
  if (this.startsAt && this.expiresAt && this.expiresAt <= this.startsAt) return next(new Error('Coupon expiry must be after its start date.'));
  if (this.usedCount > (this.usageLimit ?? Number.MAX_SAFE_INTEGER)) return next(new Error('Used count cannot exceed usage limit.'));
  next();
});

export default mongoose.model('Coupon', couponSchema);

import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema(
  {
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    gateway: { type: String, enum: ['razorpay'], default: 'razorpay' },
    gatewayOrderId: { type: String, unique: true, sparse: true, index: true },
    gatewayQrId: { type: String, unique: true, sparse: true, index: true },
    gatewayPaymentId: { type: String, unique: true, sparse: true, index: true },
    amount: { type: Number, required: true, min: 1 },
    currency: { type: String, enum: ['INR'], default: 'INR' },
    status: { type: String, enum: ['created', 'pending', 'paid', 'failed', 'expired', 'refunded'], default: 'created', index: true },
    qrImageUrl: { type: String, default: '' },
    qrCloseBy: { type: Date, default: null },
    attempt: { type: Number, required: true, min: 1 },
    failureReason: { type: String, maxlength: 500, default: '' },
    paidAt: { type: Date, default: null },
  },
  { timestamps: true }
);

paymentSchema.index({ order: 1, attempt: 1 }, { unique: true });

export default mongoose.model('Payment', paymentSchema);

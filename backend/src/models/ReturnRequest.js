import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reason: { type: String, required: true, trim: true, maxlength: 1000 },
  status: { type: String, enum: ['requested', 'approved', 'rejected', 'refunded'], default: 'requested', index: true },
  adminNote: { type: String, trim: true, maxlength: 1000, default: '' },
  refundId: { type: String, trim: true, default: '' },
  refundedAt: { type: Date, default: null }
}, { timestamps: true });

schema.index({ user: 1, createdAt: -1 });

export default mongoose.model('ReturnRequest', schema);

import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  subject: { type: String, required: true, trim: true, minlength: 3, maxlength: 160 },
  message: { type: String, required: true, trim: true, minlength: 5, maxlength: 2000 },
  status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open', index: true },
  adminReply: { type: String, trim: true, maxlength: 2000, default: '' }
}, { timestamps: true });

schema.index({ user: 1, createdAt: -1 });

export default mongoose.model('SupportTicket', schema);

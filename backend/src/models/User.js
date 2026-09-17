import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 160, index: true },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  passwordChangedAt: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model('User', schema);

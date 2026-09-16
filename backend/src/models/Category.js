import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  name: { type: String, required: true, trim: true },
  icon: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  order: { type: Number, required: true, min: 1 },
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true, versionKey: false });

export default mongoose.model('Category', categorySchema);

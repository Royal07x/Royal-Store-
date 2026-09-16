import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
  category: { type: String, required: true, lowercase: true, trim: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true, trim: true, maxlength: 2000 },
  price: { type: Number, required: true, min: 0 },
  currency: { type: String, default: 'INR', enum: ['INR'] },
  stock: { type: Number, required: true, min: 0, default: 0 },
  images: [{ type: String, trim: true }],
  active: { type: Boolean, default: true, index: true }
}, { timestamps: true, versionKey: false });

productSchema.index({ category: 1, active: 1 });
productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);

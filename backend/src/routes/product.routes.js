import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const filter = { active: true };
    if (req.query.category) filter.category = req.query.category;
    const products = await Product.find(filter).sort({ createdAt: -1 }).lean();
    res.json({ data: products });
  } catch (error) { next(error); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, active: true }).lean();
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (error) { next(error); }
});

export default router;

import { Router } from 'express';
import Category from '../models/Category.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const categories = await Category.find({ active: true }).sort({ order: 1 }).lean();
    res.json({ data: categories });
  } catch (error) { next(error); }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug, active: true }).lean();
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ data: category });
  } catch (error) { next(error); }
});

export default router;

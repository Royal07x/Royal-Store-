import { Router } from 'express';
import Coupon from '../models/Coupon.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

const normalize = (body = {}) => ({
  code: String(body.code ?? '').trim().toUpperCase(),
  type: body.type,
  value: Number(body.value),
  minSubtotal: Number(body.minSubtotal ?? 0),
  maxDiscount: body.maxDiscount === '' || body.maxDiscount == null ? null : Number(body.maxDiscount),
  usageLimit: body.usageLimit === '' || body.usageLimit == null ? null : Number(body.usageLimit),
  startsAt: body.startsAt ? new Date(body.startsAt) : null,
  expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
  active: body.active === undefined ? true : Boolean(body.active)
});

const validate = (c) => {
  if (!/^[A-Z0-9_-]{3,40}$/.test(c.code)) return 'Code must be 3–40 characters using letters, numbers, _ or -.';
  if (!['percent', 'fixed'].includes(c.type)) return 'Coupon type must be percent or fixed.';
  if (!Number.isFinite(c.value) || c.value <= 0 || (c.type === 'percent' && c.value > 100)) return 'Coupon value is invalid.';
  if (!Number.isFinite(c.minSubtotal) || c.minSubtotal < 0) return 'Minimum subtotal is invalid.';
  if (c.maxDiscount != null && (!Number.isFinite(c.maxDiscount) || c.maxDiscount <= 0)) return 'Maximum discount is invalid.';
  if (c.usageLimit != null && (!Number.isInteger(c.usageLimit) || c.usageLimit < 1)) return 'Usage limit must be a positive integer.';
  if (c.startsAt && Number.isNaN(c.startsAt.getTime())) return 'Start date is invalid.';
  if (c.expiresAt && Number.isNaN(c.expiresAt.getTime())) return 'Expiry date is invalid.';
  if (c.startsAt && c.expiresAt && c.expiresAt <= c.startsAt) return 'Expiry must be after start.';
  if (c.type === 'fixed' && c.maxDiscount != null) return 'Maximum discount is only used with percent coupons.';
  return null;
};

router.get('/', async (_req, res, next) => {
  try { res.json({ success: true, coupons: await Coupon.find().sort({ createdAt: -1 }).limit(200).lean() }); }
  catch (error) { next(error); }
});

router.post('/', async (req, res, next) => {
  try {
    const coupon = normalize(req.body);
    const error = validate(coupon);
    if (error) return res.status(400).json({ success: false, message: error });
    const created = await Coupon.create(coupon);
    res.status(201).json({ success: true, coupon: created });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'Coupon code already exists.' });
    next(error);
  }
});

router.patch('/:couponId', async (req, res, next) => {
  try {
    const coupon = normalize(req.body);
    const error = validate(coupon);
    if (error) return res.status(400).json({ success: false, message: error });
    const updated = await Coupon.findByIdAndUpdate(req.params.couponId, coupon, { new: true, runValidators: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, coupon: updated });
  } catch (error) {
    if (error?.code === 11000) return res.status(409).json({ success: false, message: 'Coupon code already exists.' });
    next(error);
  }
});

router.delete('/:couponId', async (req, res, next) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.couponId, { active: false }, { new: true }).lean();
    if (!updated) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.json({ success: true, message: 'Coupon deactivated.', coupon: updated });
  } catch (error) { next(error); }
});

export default router;

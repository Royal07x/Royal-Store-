import { Router } from 'express';
import Coupon from '../models/Coupon.js';
import { requireAuth } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = Router();
router.use(requireAuth);
const couponLimit = rateLimit({ windowMs: 60_000, max: 20 });

export function calculateDiscount(coupon, subtotal) {
  if (coupon.type === 'percent') {
    const raw = subtotal * (coupon.value / 100);
    return Math.min(raw, coupon.maxDiscount == null ? raw : coupon.maxDiscount);
  }
  return Math.min(coupon.value, subtotal);
}

export async function findValidCoupon(code, subtotal) {
  const normalized = String(code ?? '').trim().toUpperCase();
  if (!/^[A-Z0-9_-]{3,40}$/.test(normalized)) return { error: 'Invalid coupon code.' };
  if (!Number.isFinite(subtotal) || subtotal < 0) return { error: 'Invalid subtotal.' };
  const coupon = await Coupon.findOne({ code: normalized, active: true }).lean();
  if (!coupon) return { error: 'Coupon not found or inactive.' };
  const now = new Date();
  if (coupon.startsAt && now < coupon.startsAt) return { error: 'Coupon is not active yet.' };
  if (coupon.expiresAt && now >= coupon.expiresAt) return { error: 'Coupon has expired.' };
  if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) return { error: 'Coupon usage limit has been reached.' };
  if (subtotal < coupon.minSubtotal) return { error: `Minimum subtotal for this coupon is ₹${coupon.minSubtotal}.` };
  const discount = Math.max(0, Math.min(calculateDiscount(coupon, subtotal), subtotal));
  return { coupon, discount };
}

router.post('/validate', couponLimit, async (req, res, next) => {
  try {
    const result = await findValidCoupon(req.body?.code, Number(req.body?.subtotal));
    if (result.error) return res.status(400).json({ success: false, message: result.error });
    res.json({ success: true, data: { coupon: { code: result.coupon.code, type: result.coupon.type, value: result.coupon.value, discount: result.discount } } });
  } catch (error) { next(error); }
});

export default router;

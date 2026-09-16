import express from 'express';
import authRoutes from './auth.routes.js';
import cartRoutes from './cart.routes.js';
import wishlistRoutes from './wishlist.routes.js';
import orderRoutes from './order.routes.js';
import paymentRoutes from './payment.routes.js';
import returnRoutes from './return.routes.js';
import couponRoutes from './coupon.routes.js';
import reviewRoutes from './review.routes.js';
import adminRoutes from './admin.routes.js';
import adminCouponRoutes from './admin-coupon.routes.js';
import aiRoutes from './ai.routes.js';

const r = express.Router();
r.use('/auth', authRoutes);
r.use('/cart', cartRoutes);
r.use('/wishlist', wishlistRoutes);
r.use('/orders', orderRoutes);
r.use('/payments', paymentRoutes);
r.use('/returns', returnRoutes);
r.use('/coupons', couponRoutes);
r.use('/reviews', reviewRoutes);
r.use('/admin', adminRoutes);
r.use('/admin/coupons', adminCouponRoutes);
r.use('/ai', aiRoutes);

export default r;

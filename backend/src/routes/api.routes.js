import express from 'express';
import auth from './auth.routes.js';
import cart from './cart.routes.js';
import wishlist from './wishlist.routes.js';
import orders from './order.routes.js';
import payments from './payment.routes.js';

const r = express.Router();
r.use('/auth', auth);
r.use('/cart', cart);
r.use('/wishlist', wishlist);
r.use('/orders', orders);
r.use('/payments', payments);
export default r;

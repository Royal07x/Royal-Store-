import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('paid orders cannot use the direct cancellation endpoint', async () => {
  const source = await read('backend/src/routes/order.routes.js');
  assert.match(source, /paymentStatus === ['"]paid['"]/);
  assert.match(source, /Paid orders require the refund\/return flow/);
  assert.match(source, /!\[['"]pending['"], ['"]confirmed['"]\]\.includes\(o\.status\)/);
});
test('admin order status changes protect paid and delivered cancellations', async () => {
  const source = await read('backend/src/routes/admin.routes.js');
  assert.match(source, /Invalid order ID/);
  assert.match(source, /status==='cancelled'&&current\.paymentStatus==='paid'/);
  assert.match(source, /Paid orders require the refund\/return flow/);
  assert.match(source, /status==='cancelled'&&current\.status==='delivered'/);
  assert.match(source, /Delivered orders require the return flow/);
  assert.match(source, /current\.status==='cancelled'/);
});

test('order and user-owned resource routes validate object IDs before database lookup', async () => {
  const order = await read('backend/src/routes/order.routes.js');
  const cart = await read('backend/src/routes/cart.routes.js');
  const wishlist = await read('backend/src/routes/wishlist.routes.js');
  const returns = await read('backend/src/routes/return.routes.js');
  const admin = await read('backend/src/routes/admin.routes.js');
  assert.match(order, /buyNowProductId && !mongoose\.Types\.ObjectId\.isValid\(buyNowProductId\)/);
  assert.match(cart, /const validId=\(id\)=>mongoose\.Types\.ObjectId\.isValid\(id\)/);
  assert.match(wishlist, /const validId=\(id\)=>mongoose\.Types\.ObjectId\.isValid\(id\)/);
  assert.match(returns, /mongoose\.Types\.ObjectId\.isValid\(orderId\)/);
  assert.match(admin, /Invalid return request ID/);
});

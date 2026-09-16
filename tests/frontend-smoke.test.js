import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('required frontend pages and assets exist', async () => {
  for (const path of [
    'frontend/index.html',
    'frontend/shop.html',
    'frontend/category.html',
    'frontend/auth.html',
    'frontend/cart.html',
    'frontend/checkout.html',
    'frontend/payment.html',
    'frontend/orders.html',
    'frontend/css/styles.css',
    'frontend/js/app.js',
    'frontend/js/home.js',
    'frontend/js/shop.js',
    'frontend/js/category.js',
    'frontend/js/auth.js',
    'frontend/data/catalog.js',
  ]) {
    const content = await read(path);
    assert.ok(content.length > 0, `${path} should not be empty`);
  }
});

test('catalog keeps exactly the five approved categories', async () => {
  const source = await read('frontend/data/catalog.js');
  for (const id of ['pants', 'shirt', 'beauty', 'sneakers', 'kids-toy']) assert.match(source, new RegExp(`['"]${id}['"]`));
  assert.doesNotMatch(source, /electronics|jewelry|watch|furniture/i);
});

test('payment page uses server-created attempts and server verification', async () => {
  const source = await read('frontend/payment.html');
  assert.ok(source.includes('/api/payments/orders/${encodeURIComponent(orderId)}/create'));
  assert.ok(source.includes('/api/payments/verify'));
  assert.ok(source.includes('razorpay_order_id'));
  assert.ok(source.includes('razorpay_payment_id'));
  assert.ok(source.includes('razorpay_signature'));
  assert.ok(source.includes('/api/payments/orders/${encodeURIComponent(orderId)}/qr'));
  assert.ok(source.includes('QR expires in'));
  assert.ok(source.includes("status === 'paid'"));
  assert.doesNotMatch(source, /fake payment|payment successful without verification/i);
});

test('admin and AI routes are mounted behind their route modules', async () => {
  const source = await read('backend/src/routes/api.routes.js');
  assert.match(source, /adminRoutes/);
  assert.match(source, /aiRoutes/);
});

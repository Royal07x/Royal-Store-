import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('coupon routes require authentication and admin coupon routes require admin role', async () => {
  const customer = await read('backend/src/routes/coupon.routes.js');
  const admin = await read('backend/src/routes/admin-coupon.routes.js');
  assert.match(customer, /router\.use\(requireAuth\)/);
  assert.match(admin, /requireRole\('admin'\)/);
  assert.match(customer, /findValidCoupon/);
  assert.match(admin, /Coupon\.create/);
});

test('coupon checkout never trusts a client-supplied discount amount', async () => {
  const order = await read('backend/src/routes/order.routes.js');
  assert.match(order, /findValidCoupon/);
  assert.match(order, /const total = Math\.max\(0, subtotal - discount \+ fee\)/);
  assert.doesNotMatch(order, /body\.discount/);
});

test('coupon model supports percent/fixed, validity and usage controls', async () => {
  const model = await read('backend/src/models/Coupon.js');
  for (const field of ['code', 'type', 'value', 'minSubtotal', 'usageLimit', 'usedCount', 'startsAt', 'expiresAt', 'active']) assert.match(model, new RegExp(field));
});

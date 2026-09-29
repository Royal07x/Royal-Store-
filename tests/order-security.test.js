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

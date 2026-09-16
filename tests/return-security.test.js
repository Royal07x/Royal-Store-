import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('return flow requires delivered paid orders and blocks duplicate requests', async () => {
  const source = await read('backend/src/routes/return.routes.js');
  assert.match(source, /order\.status !== ['"]delivered['"]/);
  assert.match(source, /order\.paymentStatus !== ['"]paid['"]/);
  assert.match(source, /ReturnRequest\.findOne\(\{ order: order\._id \}\)/);
});

test('refund flow requires admin approval and a captured gateway payment', async () => {
  const source = await read('backend/src/routes/admin.routes.js');
  assert.match(source, /requireRole\(['"]admin['"]\)/);
  assert.match(source, /request\.status !== ['"]approved['"]/);
  assert.match(source, /payment\.gatewayPaymentId/);
  assert.match(source, /createRefund\(/);
  assert.match(source, /payment\.status = ['"]refunded['"]/);
});

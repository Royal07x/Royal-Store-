import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('return flow requires delivered paid orders and blocks duplicate requests', async () => {
  const source = await read('backend/src/routes/return.routes.js');
  assert.match(source, /order\.status\s*!==\s*['"]delivered['"]/);
  assert.match(source, /order\.paymentStatus\s*!==\s*['"]paid['"]/);
  assert.match(source, /ReturnRequest\.findOne\(\{\s*order:\s*order\._id\s*\}\)/);
});

test('refund flow requires admin approval and a captured gateway payment', async () => {
  const source = await read('backend/src/routes/admin.routes.js');
  assert.match(source, /requireRole\(\s*['"]admin['"]\s*\)/);
  assert.match(source, /request\.status\s*!==\s*['"]approved['"]/);
  assert.match(source, /payment\.gatewayPaymentId/);
  assert.match(source, /createRefund\(/);
  assert.match(source, /payment\.status\s*=\s*['"]refunded['"]/);
});

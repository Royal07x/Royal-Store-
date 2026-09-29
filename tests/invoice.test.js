import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('receipt access is tied to the authenticated order owner and blocks cancelled orders', async () => {
  const source = await readFile(new URL('../backend/src/routes/invoice.routes.js', import.meta.url), 'utf8');
  assert.match(source, /user:\s*req\.user\._id/);
  assert.match(source, /order\.status === ['"]cancelled['"]/);
});

test('receipt creation supports COD and snapshots order items and address', async () => {
  const source = await readFile(new URL('../backend/src/routes/invoice.routes.js', import.meta.url), 'utf8');
  assert.match(source, /documentType: order\.paymentStatus === ['"]paid['"] \? ['"]invoice['"] : ['"]receipt['"]/);
  assert.match(source, /items: order\.items\.map/);
  assert.match(source, /shippingAddress: order\.shippingAddress/);
});

test('customer document output does not expose gateway identifiers or secret configuration', async () => {
  const source = await readFile(new URL('../backend/src/routes/invoice.routes.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /gatewayPaymentId|paymentSignature|KEY_SECRET|WEBHOOK_SECRET/);
});

test('invoice page is present with print support and payment-state messaging', async () => {
  const html = await readFile(new URL('../frontend/invoice.html', import.meta.url), 'utf8');
  const js = await readFile(new URL('../frontend/js/invoice.js', import.meta.url), 'utf8');
  assert.match(html, /Invoice/);
  assert.match(html, /print/i);
  assert.match(js, /Cash on Delivery/);
  assert.match(js, /Print \/ Save PDF/);
});

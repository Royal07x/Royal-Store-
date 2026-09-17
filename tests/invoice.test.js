import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('invoice implementation keeps invoice access tied to the authenticated order owner', async () => {
  const source = await readFile(new URL('../backend/src/routes/invoice.routes.js', import.meta.url), 'utf8');
  assert.match(source, /user:\s*req\.user\._id/);
  assert.match(source, /paymentStatus\s*!==\s*['"]paid['"]/);
});

test('invoice output does not expose gateway payment identifiers', async () => {
  const source = await readFile(new URL('../backend/src/routes/invoice.routes.js', import.meta.url), 'utf8');
  assert.doesNotMatch(source, /gatewayPaymentId|RAZORPAY_KEY_SECRET|RAZORPAY_WEBHOOK_SECRET/);
});

test('invoice page is present with print support', async () => {
  const html = await readFile(new URL('../frontend/invoice.html', import.meta.url), 'utf8');
  assert.match(html, /Invoice/);
  assert.match(html, /print/i);
});

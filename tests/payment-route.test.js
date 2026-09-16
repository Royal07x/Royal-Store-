import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('Razorpay verification binds the client response to the stored payment attempt', async () => {
  const source = await read('backend/src/routes/payment.routes.js');
  assert.match(source, /const \{ paymentId, razorpayOrderId, razorpayPaymentId, razorpaySignature \}/);
  assert.match(source, /Payment\.findOne\(\{ _id: paymentId, user: req\.user\._id \}\)/);
  assert.match(source, /razorpayOrderId !== payment\.gatewayOrderId/);
  assert.match(source, /verifyPaymentSignature\(\{ orderId: payment\.gatewayOrderId, paymentId: razorpayPaymentId, signature: razorpaySignature \}\)/);
  assert.match(source, /gatewayPayment\.order_id !== payment\.gatewayOrderId/);
  assert.match(source, /gatewayPayment\.status !== 'captured'/);
});

test('QR payment creation rejects cancelled orders', async () => {
  const source = await read('backend/src/routes/payment.routes.js');
  assert.match(source, /router\.post\('\/orders\/:orderId\/qr'/);
  assert.match(source, /order\.status === 'cancelled'/);
});

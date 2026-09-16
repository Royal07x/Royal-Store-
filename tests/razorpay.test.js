import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';

process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/royal-store-v2-test';
process.env.RAZORPAY_KEY_SECRET ||= 'test-razorpay-secret';
process.env.RAZORPAY_WEBHOOK_SECRET ||= 'test-webhook-secret';

const { verifyPaymentSignature, verifyWebhookSignature } = await import('../backend/src/utils/razorpay.js');

function hmac(secret, value) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

test('payment signature accepts a valid Razorpay signature', () => {
  const orderId = 'order_test_123';
  const paymentId = 'pay_test_456';
  const signature = hmac(process.env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
  assert.equal(verifyPaymentSignature({ orderId, paymentId, signature }), true);
});

test('payment signature rejects invalid or malformed input', () => {
  assert.equal(verifyPaymentSignature({ orderId: 'order_test_123', paymentId: 'pay_test_456', signature: 'bad' }), false);
  assert.equal(verifyPaymentSignature({ orderId: '', paymentId: 'pay_test_456', signature: 'bad' }), false);
});

test('webhook signature accepts exact raw payload', () => {
  const raw = Buffer.from('{"event":"payment.captured"}');
  const signature = hmac(process.env.RAZORPAY_WEBHOOK_SECRET, raw);
  assert.equal(verifyWebhookSignature(raw, signature), true);
});

test('webhook signature rejects changed payload', () => {
  const raw = Buffer.from('{"event":"payment.captured"}');
  const signature = hmac(process.env.RAZORPAY_WEBHOOK_SECRET, raw);
  assert.equal(verifyWebhookSignature(Buffer.from('{"event":"payment.failed"}'), signature), false);
  assert.equal(verifyWebhookSignature(raw, 'bad'), false);
});

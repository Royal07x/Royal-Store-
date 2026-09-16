import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/royal-store-v2-test';

const { collectHealth } = await import('../backend/src/services/health.service.js');

test('health response does not expose secrets or private identifiers', () => {
  const health = collectHealth();
  const text = JSON.stringify(health).toLowerCase();
  assert.equal(text.includes('password'), false);
  assert.equal(text.includes('customeremail'), false);
  assert.equal(text.includes('razorpay_key_secret'), false);
  assert.equal(text.includes('api_key'), false);
  assert.equal(text.includes('gatewaypaymentid'), false);
});

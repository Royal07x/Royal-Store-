import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/royal-store-v2-test';

const { collectHealth } = await import('../backend/src/services/health.service.js');

test('health report is safe for public exposure', () => {
  const health = collectHealth();
  assert.ok(['ok', 'degraded'].includes(health.status));
  assert.equal(typeof health.generatedAt, 'string');
  assert.equal(health.securityConfig.apiSecretsExposed, false);
  assert.equal('customerData' in health, false);
  assert.equal('paymentIdentifiers' in health, false);
});

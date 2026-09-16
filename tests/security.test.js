import test from 'node:test';
import assert from 'node:assert/strict';

process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/royal-store-v2-test';
process.env.JWT_SECRET ||= 'test-only-secret';
process.env.RAZORPAY_KEY_SECRET ||= 'test-razorpay-secret';
process.env.RAZORPAY_WEBHOOK_SECRET ||= 'test-webhook-secret';

const { requireAuth, requireRole } = await import('../backend/src/middleware/auth.js');
const { rateLimit } = await import('../backend/src/middleware/rateLimit.js');

const response = () => ({ statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; }, set() {} });

test('requireAuth rejects missing bearer token', async () => {
  const req = { get: () => undefined };
  const res = response();
  let nextCalled = false;
  await requireAuth(req, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('requireRole rejects unauthorised roles', () => {
  const req = { user: { role: 'customer' } };
  const res = response();
  let nextCalled = false;
  requireRole('admin')(req, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

test('rate limiter returns 429 after the configured limit', () => {
  const limiter = rateLimit({ windowMs: 60_000, max: 2, key: () => 'security-test' });
  const makeReq = () => ({ baseUrl: '/api', path: '/test' });
  const makeRes = () => ({ statusCode: 200, headers: {}, set(name, value) { this.headers[name] = value; }, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } });
  let next = 0;
  const a = makeRes(); limiter(makeReq(), a, () => next++);
  const b = makeRes(); limiter(makeReq(), b, () => next++);
  const c = makeRes(); limiter(makeReq(), c, () => next++);
  assert.equal(next, 2);
  assert.equal(c.statusCode, 429);
});

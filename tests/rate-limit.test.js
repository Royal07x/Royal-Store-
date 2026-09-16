import test from 'node:test';
import assert from 'node:assert/strict';
import { rateLimit } from '../backend/src/middleware/rateLimit.js';

test('rate limiter returns 429 after the configured limit', () => {
  const middleware = rateLimit({ windowMs: 60_000, max: 2, key: () => 'test-rate-limit' });
  const responses = [];
  const makeRes = () => ({
    headers: {},
    set(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  });
  for (let i = 0; i < 3; i += 1) {
    const res = makeRes();
    let nextCalled = false;
    middleware({ ip: '127.0.0.1', baseUrl: '/test', path: '/route' }, res, () => { nextCalled = true; });
    responses.push({ status: res.statusCode || 200, nextCalled });
  }
  assert.deepEqual(responses.map((x) => x.status), [200, 200, 429]);
  assert.equal(responses[2].nextCalled, false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { requireAuth, requireRole } from '../backend/src/middleware/auth.js';

test('requireAuth rejects missing authorization', () => {
  const res = { status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
  let nextCalled = false;
  requireAuth({ get: () => undefined }, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 401);
  assert.equal(nextCalled, false);
});

test('requireRole rejects users without the required role', () => {
  const res = { status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } };
  let nextCalled = false;
  requireRole('admin')({ user: { role: 'customer' } }, res, () => { nextCalled = true; });
  assert.equal(res.statusCode, 403);
  assert.equal(nextCalled, false);
});

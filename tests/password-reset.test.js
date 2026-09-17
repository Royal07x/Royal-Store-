import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('password reset stores only a hash and expires tokens', async () => {
  const source = await read('backend/src/models/PasswordResetToken.js');
  assert.match(source, /tokenHash/);
  assert.match(source, /expiresAt/);
  assert.match(source, /expireAfterSeconds/);
  assert.match(source, /usedAt/);
  assert.doesNotMatch(source, /token:\s*\{/);
});

test('reset API consumes tokens atomically and hashes the new password', async () => {
  const source = await read('backend/src/routes/auth.routes.js');
  assert.match(source, /findOneAndUpdate\(/);
  assert.match(source, /usedAt:\s*null/);
  assert.match(source, /expiresAt:\s*\{\s*\$gt:/);
  assert.match(source, /bcrypt\.hash\(password, 12\)/);
  assert.match(source, /passwordChangedAt\s*=\s*new Date\(\)/);
  assert.doesNotMatch(source, /res\.json\(\{[^}]*rawToken/);
});

test('forgot-password response does not reveal whether an account exists', async () => {
  const source = await read('backend/src/routes/auth.routes.js');
  assert.match(source, /If an account exists for that email/);
  assert.match(source, /status\(202\)/);
});

test('password changes invalidate older JWT sessions', async () => {
  const source = await read('backend/src/middleware/auth.js');
  assert.match(source, /passwordChangedAt/);
  assert.match(source, /payload\.iat/);
});

test('password reset delivery is never allowed to expose a reset token in production', async () => {
  const source = await read('backend/src/services/password-reset.service.js');
  assert.match(source, /NODE_ENV === 'production'/);
  assert.match(source, /Console password-reset delivery is not allowed in production/);
  assert.match(source, /Email password-reset delivery adapter is not configured yet/);
});

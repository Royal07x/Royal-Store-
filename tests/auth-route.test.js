import test from 'node:test';
import assert from 'node:assert/strict';

process.env.NODE_ENV ||= 'test';
process.env.MONGODB_URI ||= 'mongodb://127.0.0.1:27017/royal-store-v2-test';
process.env.JWT_SECRET ||= 'royal-store-v2-test-jwt-secret-not-for-production';

const { env } = await import('../backend/src/config/env.js');
assert.ok(env.JWT_SECRET);

test('auth JWT configuration is sourced from validated env', async () => {
  const source = await import('node:fs/promises').then((fs) => fs.readFile(new URL('../backend/src/routes/auth.routes.js', import.meta.url), 'utf8'));
  assert.match(source, /import \{ env \} from ['"]\.\.\/config\/env\.js['"]/);
  assert.match(source, /jwt\.sign\([^\n]*env\.JWT_SECRET/);
  assert.doesNotMatch(source, /jwt\.sign\([^\n]*process\.env\.JWT_SECRET/);
});

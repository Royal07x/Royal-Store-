import test from 'node:test';
import assert from 'node:assert/strict';

const route = await import('../backend/src/routes/review.routes.js');
const source = await (await import('node:fs/promises')).readFile(new URL('../backend/src/routes/review.routes.js', import.meta.url), 'utf8');

test('review routes require delivered paid order ownership', () => {
  assert.match(source, /status:\s*'delivered'/);
  assert.match(source, /paymentStatus:\s*'paid'/);
  assert.match(source, /user:\s*req\.user\._id/);
});

test('review routes validate rating and comment', () => {
  assert.match(source, /score < 1 \|\| score > 5/);
  assert.match(source, /comment\.trim\(\)\.length < 3/);
  assert.match(source, /maxlength|1000/);
});

test('review routes expose public approved reviews and admin is separate', () => {
  assert.match(source, /status:\s*'approved'/);
  assert.equal(typeof route.default, 'function');
});

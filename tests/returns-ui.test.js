import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const source = fs.readFileSync('frontend/returns.html', 'utf8');

test('returns page uses authenticated API and does not expose secrets', () => {
  assert.match(source, /authFetch\(['"]\/api\/returns['"]\)/);
  assert.match(source, /isLoggedIn\(\)/);
  assert.match(source, /escapeHtml/);
  assert.doesNotMatch(source, /RAZORPAY_KEY_SECRET|JWT_SECRET|CLOUD_AI_API_KEY/);
});

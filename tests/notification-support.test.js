import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('customer notification routes require authentication and user ownership', async () => {
  const source = await read('backend/src/routes/notification.routes.js');
  assert.match(source, /router\.use\(requireAuth\)/);
  assert.match(source, /user:\s*req\.user\._id/);
  assert.match(source, /findOneAndUpdate\(\{ _id: req\.params\.id, user: req\.user\._id \}/);
});

test('support routes validate input and rate limit ticket creation', async () => {
  const source = await read('backend/src/routes/support.routes.js');
  assert.match(source, /router\.use\(requireAuth\)/);
  assert.match(source, /max:\s*5/);
  assert.match(source, /subject\.trim\(\)\.length < 3/);
  assert.match(source, /message\.trim\(\)\.length < 5/);
  assert.match(source, /user:\s*req\.user\._id/);
});

test('admin support updates create a customer notification', async () => {
  const source = await read('backend/src/routes/admin.routes.js');
  assert.match(source, /router\.use\(requireAuth, requireRole\(['"]admin['"]\)\)/);
  assert.match(source, /SupportTicket\.find\(\)/);
  assert.match(source, /Notification\.create\(/);
  assert.match(source, /type:\s*['"]support['"]/);
});

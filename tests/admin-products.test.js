import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const route = fs.readFileSync(path.join(root, 'backend/src/routes/admin.routes.js'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'admin/js/admin.js'), 'utf8');

 test('admin product routes require admin role', () => {
  assert.match(route, /router\.use\(requireAuth, requireRole\('admin'\)\)/);
});

test('product management validates approved active categories', () => {
  assert.match(route, /Category\.findOne\(\{ slug: product\.category, active: true \}/);
  assert.match(route, /Category must be one of the active approved categories/);
});

test('product management supports list, create, update and safe deactivation', () => {
  assert.match(route, /router\.get\('\/products'/);
  assert.match(route, /router\.post\('\/products'/);
  assert.match(route, /router\.patch\('\/products\/:productId'/);
  assert.match(route, /router\.delete\('\/products\/:productId'/);
  assert.match(route, /\{ active: false \}/);
});

test('admin product UI uses the protected product API', () => {
  assert.match(ui, /req\('\/admin\/products'/);
  assert.match(ui, /method:editingProductId\?'PATCH':'POST'/);
  assert.match(ui, /data-deactivate-product/);
});

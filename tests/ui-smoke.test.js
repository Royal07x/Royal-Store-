import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const requiredFiles = ['frontend/index.html','frontend/shop.html','frontend/category.html','frontend/css/styles.css','frontend/js/app.js','frontend/js/home.js','frontend/js/shop.js','frontend/js/category.js','frontend/data/catalog.js','admin/index.html','admin/css/admin.css','admin/js/admin.js'];

test('required storefront and admin files exist', () => {
  for (const file of requiredFiles) assert.equal(existsSync(file), true, `${file} is missing`);
});

test('storefront and admin do not contain obvious server-secret names', () => {
  const source = requiredFiles.map((file) => readFileSync(file, 'utf8')).join('\n').toLowerCase();
  assert.equal(source.includes('razorpay_key_secret'), false);
  assert.equal(source.includes('cloud_ai_api_key'), false);
  assert.equal(source.includes('jwt_secret'), false);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('required frontend pages and assets exist', async () => {
  for (const path of [
    'frontend/index.html',
    'frontend/shop.html',
    'frontend/category.html',
    'frontend/css/styles.css',
    'frontend/js/app.js',
    'frontend/js/home.js',
    'frontend/js/shop.js',
    'frontend/js/category.js',
    'frontend/data/catalog.js',
  ]) {
    const content = await read(path);
    assert.ok(content.length > 0, `${path} should not be empty`);
  }
});

test('catalog keeps exactly the five approved categories', async () => {
  const source = await read('frontend/data/catalog.js');
  for (const id of ['pants', 'shirt', 'beauty', 'sneakers', 'kids-toy']) assert.match(source, new RegExp(`['"]${id}['"]`));
  assert.doesNotMatch(source, /electronics|jewelry|watch|furniture/i);
});

test('admin and AI routes are mounted behind their route modules', async () => {
  const source = await read('backend/src/routes/api.routes.js');
  assert.match(source, /adminRoutes/);
  assert.match(source, /aiRoutes/);
});

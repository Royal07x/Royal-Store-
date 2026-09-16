import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, products, getProductsByCategory } from '../frontend/data/catalog.js';

const expected = ['pants', 'shirt', 'beauty', 'sneakers', 'kids-toy'];

test('catalog contains exactly the five approved categories', () => {
  assert.deepEqual(categories.map((category) => category.id), expected);
  assert.equal(new Set(categories.map((category) => category.id)).size, 5);
});

test('every catalog product belongs to an approved category', () => {
  for (const product of products) assert.ok(expected.includes(product.category));
});

test('category filtering returns only products from that category', () => {
  for (const category of categories) {
    const result = getProductsByCategory(category.id);
    assert.ok(result.length > 0);
    assert.ok(result.every((product) => product.category === category.id));
  }
});

import { products, renderProductGrid } from './catalog-ui.js';

const grid = document.querySelector('#all-products-grid');
renderProductGrid(grid, products);

import { loadProducts, renderProductGrid } from './catalog-ui.js';

const grid = document.querySelector('#all-products-grid');
loadProducts().then((items) => renderProductGrid(grid, items));

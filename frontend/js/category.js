import { loadCategory, loadProducts, getCategoryFromUrl, renderProductGrid } from './catalog-ui.js';

const categoryId = getCategoryFromUrl();
const title = document.querySelector('#category-title');
const description = document.querySelector('#category-description');
const count = document.querySelector('#category-count');
const grid = document.querySelector('#product-grid');

const render = async () => {
  const category = await loadCategory(categoryId);
  if (!category) {
    title.textContent = 'Category not found';
    description.textContent = 'Choose one of the five approved categories from the home page.';
    count.textContent = '';
    if (grid) grid.innerHTML = '<a class="primary-button" href="./index.html#categories">Back to categories <span>→</span></a>';
    return;
  }

  document.title = `${category.name} | Royal Store V2`;
  title.textContent = `${category.icon} ${category.name}`;
  description.textContent = category.description;
  const items = await loadProducts(category.slug || category.id);
  count.textContent = `${items.length} products`;
  renderProductGrid(grid, items);
};

render();

document.querySelector('#back-home')?.addEventListener('click', (event) => {
  event.preventDefault();
  window.location.href = './index.html#categories';
});

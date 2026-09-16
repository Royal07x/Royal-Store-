import { loadCategories, renderCategoryCards } from './catalog-ui.js';

const categoriesGrid = document.querySelector('#categories-grid');
loadCategories().then((categories) => renderCategoryCards(categoriesGrid, categories));

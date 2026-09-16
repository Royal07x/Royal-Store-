import { categories, products, getCategory, getProductsByCategory } from './catalog.js';

const formatPrice = (value) => `₹${value.toLocaleString('en-IN')}`;

export const renderCategoryCards = (container) => {
  if (!container) return;
  container.innerHTML = categories.map((category) => `
    <a class="category-card glass" href="./category.html?category=${encodeURIComponent(category.id)}" data-category="${category.id}">
      <span class="category-icon" aria-hidden="true">${category.icon}</span>
      <span class="category-name">${category.name}</span>
      <span class="category-description">${category.description}</span>
      <span class="category-link">Shop category <span aria-hidden="true">→</span></span>
    </a>
  `).join('');
};

export const renderProductGrid = (container, items = products) => {
  if (!container) return;
  container.innerHTML = items.map((product) => `
    <article class="product-card glass">
      <div class="product-visual" aria-hidden="true"><span>${product.emoji}</span><small>${product.badge}</small></div>
      <div class="product-content">
        <div class="product-rating">★ ${product.rating}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <strong>${formatPrice(product.price)}</strong>
          <button class="product-action" type="button" data-product-id="${product.id}">View</button>
        </div>
      </div>
    </article>
  `).join('');
};

export const getCategoryFromUrl = () => new URLSearchParams(window.location.search).get('category');
export { categories, products, getCategory, getProductsByCategory };

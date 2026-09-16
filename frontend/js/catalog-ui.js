import { categories as localCategories, products as localProducts, getCategory as getLocalCategory, getProductsByCategory as getLocalProductsByCategory } from './catalog.js';

const API_BASE = (window.ROYAL_STORE_API_BASE || '').replace(/\/$/, '');
const formatPrice = (value) => `₹${Number(value).toLocaleString('en-IN')}`;

const apiGet = async (path) => {
  const response = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const payload = await response.json();
  return payload.data;
};

export const loadCategories = async () => {
  try {
    const data = await apiGet('/api/categories');
    return Array.isArray(data) ? data : localCategories;
  } catch {
    return localCategories;
  }
};

export const loadProducts = async (category) => {
  try {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    const data = await apiGet(`/api/products${query}`);
    return Array.isArray(data) ? data : (category ? localProducts.filter((p) => p.category === category) : localProducts);
  } catch {
    return category ? localProducts.filter((p) => p.category === category) : localProducts;
  }
};

export const loadCategory = async (id) => {
  try {
    const data = await apiGet(`/api/categories/${encodeURIComponent(id)}`);
    return data || getLocalCategory(id);
  } catch {
    return getLocalCategory(id);
  }
};

export const renderCategoryCards = (container, items = localCategories) => {
  if (!container) return;
  container.innerHTML = items.map((category) => `
    <a class="category-card glass" href="./category.html?category=${encodeURIComponent(category.slug || category.id)}" data-category="${category.slug || category.id}">
      <span class="category-icon" aria-hidden="true">${category.icon}</span>
      <span class="category-name">${category.name}</span>
      <span class="category-description">${category.description}</span>
      <span class="category-link">Shop category <span aria-hidden="true">→</span></span>
    </a>
  `).join('');
};

export const renderProductGrid = (container, items = localProducts) => {
  if (!container) return;
  container.innerHTML = items.map((product) => `
    <article class="product-card glass">
      <div class="product-visual" aria-hidden="true"><span>${product.emoji || '🛍️'}</span><small>${product.badge || 'Royal'}</small></div>
      <div class="product-content">
        <div class="product-rating">★ ${product.rating || 'New'}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-footer">
          <strong>${formatPrice(product.price)}</strong>
          <button class="product-action" type="button" data-product-id="${product._id || product.id}">View</button>
        </div>
      </div>
    </article>
  `).join('');
};

export const getCategoryFromUrl = () => new URLSearchParams(window.location.search).get('category');
export { localCategories as categories, localProducts as products, getLocalCategory as getCategory, getLocalProductsByCategory as getProductsByCategory };

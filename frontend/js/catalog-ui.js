import { categories as localCategories, products as localProducts, getCategory as getLocalCategory, getProductsByCategory as getLocalProductsByCategory } from './catalog.js';

const API_BASE = (window.ROYAL_STORE_API_BASE || '').replace(/\/$/, '');
const formatPrice = (value) => `₹${Number(value).toLocaleString('en-IN')}`;
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);

const apiGet = async (path) => {
  const response = await fetch(`${API_BASE}${path}`, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  const payload = await response.json();
  return payload.data;
};

export const loadCategories = async () => { try { const data = await apiGet('/api/categories'); return Array.isArray(data) ? data : localCategories; } catch { return localCategories; } };
export const loadProducts = async (category) => { try { const query = category ? `?category=${encodeURIComponent(category)}` : ''; const data = await apiGet(`/api/products${query}`); return Array.isArray(data) ? data : (category ? localProducts.filter((p) => p.category === category) : localProducts); } catch { return category ? localProducts.filter((p) => p.category === category) : localProducts; } };
export const loadCategory = async (id) => { try { const data = await apiGet(`/api/categories/${encodeURIComponent(id)}`); return data || getLocalCategory(id); } catch { return getLocalCategory(id); } };

export const renderCategoryCards = (container, items = localCategories) => {
  if (!container) return;
  container.innerHTML = items.map((category) => { const id = category.slug || category.id; return `
    <a class="category-card glass" href="./category.html?category=${encodeURIComponent(id)}" data-category="${escapeHtml(id)}">
      <span class="category-icon" aria-hidden="true">${escapeHtml(category.icon)}</span>
      <span class="category-name">${escapeHtml(category.name)}</span>
      <span class="category-description">${escapeHtml(category.description)}</span>
      <span class="category-link">Shop category <span aria-hidden="true">→</span></span>
    </a>`; }).join('');
};

export const renderProductGrid = (container, items = localProducts) => {
  if (!container) return;
  container.innerHTML = items.map((product) => `
    <article class="product-card glass">
      <div class="product-visual" aria-hidden="true"><span>${escapeHtml(product.emoji || '🛍️')}</span><small>${escapeHtml(product.badge || 'Royal')}</small></div>
      <div class="product-content">
        <div class="product-rating">★ ${escapeHtml(product.rating || 'New')}</div>
        <h3>${escapeHtml(product.name)}</h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-footer"><strong>${formatPrice(product.price)}</strong><button class="product-action" type="button" data-product-id="${escapeHtml(product._id || product.id)}">View</button></div>
      </div>
    </article>`).join('');
};

export const getCategoryFromUrl = () => new URLSearchParams(window.location.search).get('category');
export { localCategories as categories, localProducts as products, getLocalCategory as getCategory, getLocalProductsByCategory as getProductsByCategory };

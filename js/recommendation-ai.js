/* ==========================================================
   recommendation-ai.js — AI Recommendation
   Lightweight, on-device "recommendations" based on category
   affinity from cart, wishlist and view history — no server
   or external model involved.
   ========================================================== */

window.RS = window.RS || {};

RS.Recommend = (function () {
  function recordView(productId) {
    const views = RS.DB.read("views", []);
    views.unshift(productId);
    RS.DB.write("views", views.slice(0, 30));
  }

  function categoryAffinity() {
    const scores = {};
    const bump = (id, weight) => {
      const p = RS.Products.getById(id);
      if (p) scores[p.category] = (scores[p.category] || 0) + weight;
    };
    RS.DB.read("views", []).forEach((id) => bump(id, 1));
    RS.Wishlist.getIds().forEach((id) => bump(id, 2));
    RS.Cart.getItems().forEach((i) => bump(i.productId, 3));
    return scores;
  }

  function forYou(limit) {
    const scores = categoryAffinity();
    const topCategory = Object.keys(scores).sort((a, b) => scores[b] - scores[a])[0];
    const pool = topCategory ? RS.Products.getByCategory(topCategory) : RS.Products.getAll();
    return pool.slice(0, limit || 4);
  }

  function similarTo(productId, limit) {
    const product = RS.Products.getById(productId);
    if (!product) return [];
    return RS.Products.getByCategory(product.category)
      .filter((p) => p.id !== productId)
      .slice(0, limit || 4);
  }

  return { recordView, forYou, similarTo };
})();

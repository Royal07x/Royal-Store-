/* ==========================================================
   cart.js — Shopping Cart
   Add To Cart works without login (locked feature). Buy Now
   in checkout.js is the step that requires a session.
   ========================================================== */

window.RS = window.RS || {};

RS.Cart = (function () {
  const KEY = "cart";

  function getItems() {
    return RS.DB.read(KEY, []);
  }

  function save(items) {
    RS.DB.write(KEY, items);
    document.dispatchEvent(new CustomEvent("rs:cart-changed", { detail: { items } }));
  }

  function add(productId, qty) {
    qty = qty || 1;
    const items = getItems();
    const existing = items.find((i) => i.productId === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      items.push({ productId, qty });
    }
    save(items);
    RS.UI && RS.UI.toast("Added to cart", "success");
    return items;
  }

  function remove(productId) {
    const items = getItems().filter((i) => i.productId !== productId);
    save(items);
    return items;
  }

  function setQty(productId, qty) {
    const items = getItems();
    const item = items.find((i) => i.productId === productId);
    if (item) {
      item.qty = Math.max(1, qty);
      save(items);
    }
    return items;
  }

  function clear() {
    save([]);
  }

  function count() {
    return getItems().reduce((sum, i) => sum + i.qty, 0);
  }

  function detailedItems() {
    return getItems()
      .map((i) => {
        const product = RS.Products.getById(i.productId);
        return product ? { ...i, product } : null;
      })
      .filter(Boolean);
  }

  function subtotal() {
    return detailedItems().reduce((sum, i) => sum + i.product.price * i.qty, 0);
  }

  return { getItems, add, remove, setQty, clear, count, detailedItems, subtotal };
})();

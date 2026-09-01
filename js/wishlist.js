/* ==========================================================
   wishlist.js — Wishlist
   ========================================================== */

window.RS = window.RS || {};

RS.Wishlist = (function () {
  const KEY = "wishlist";

  function getIds() {
    return RS.DB.read(KEY, []);
  }

  function save(ids) {
    RS.DB.write(KEY, ids);
    document.dispatchEvent(new CustomEvent("rs:wishlist-changed", { detail: { ids } }));
  }

  function has(productId) {
    return getIds().includes(productId);
  }

  function toggle(productId) {
    let ids = getIds();
    if (ids.includes(productId)) {
      ids = ids.filter((id) => id !== productId);
      RS.UI && RS.UI.toast("Removed from wishlist");
    } else {
      ids.push(productId);
      RS.UI && RS.UI.toast("Saved to wishlist", "success");
    }
    save(ids);
    return ids;
  }

  function count() {
    return getIds().length;
  }

  function detailedItems() {
    return getIds()
      .map((id) => RS.Products.getById(id))
      .filter(Boolean);
  }

  return { getIds, has, toggle, count, detailedItems };
})();

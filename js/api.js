/* ==========================================================
   api.js — API Layer
   Every "network" call in Royal Store goes through here.
   Right now it resolves against RS.DB with a small delay so
   the rest of the app already talks to a proper async
   boundary — pointing this at a real backend later only
   means rewriting the bodies of these functions.
   ========================================================== */

window.RS = window.RS || {};

RS.API = (function () {
  const LATENCY = 250;

  function call(fn) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(fn()), LATENCY);
    });
  }

  function getUsers() {
    return call(() => RS.DB.read("users", []));
  }

  function saveUsers(users) {
    return call(() => RS.DB.write("users", users));
  }

  function getOrders() {
    return call(() => RS.DB.read("orders", []));
  }

  function saveOrders(orders) {
    return call(() => RS.DB.write("orders", orders));
  }

  function getCart() {
    return call(() => RS.DB.read("cart", []));
  }

  function saveCart(cart) {
    return call(() => RS.DB.write("cart", cart));
  }

  return { getUsers, saveUsers, getOrders, saveOrders, getCart, saveCart };
})();

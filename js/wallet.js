/* ==========================================================
   wallet.js — Wallet
   Simple store-credit balance a user can build up (via
   returns/refunds) and spend at checkout.
   ========================================================== */

window.RS = window.RS || {};

RS.Wallet = (function () {
  function key(userId) {
    return "wallet:" + userId;
  }

  function balance() {
    const user = RS.Auth.currentUser();
    if (!user) return 0;
    return RS.DB.read(key(user.id), 0);
  }

  function credit(amount) {
    const user = RS.Auth.currentUser();
    if (!user) return 0;
    const next = balance() + Math.max(0, amount);
    RS.DB.write(key(user.id), next);
    return next;
  }

  // Reserves up to `amount` from the wallet toward an order total, returns the amount used.
  function reserve(amount) {
    const user = RS.Auth.currentUser();
    if (!user) return 0;
    const bal = balance();
    const used = Math.min(bal, Math.max(0, amount));
    RS.DB.write(key(user.id), bal - used);
    return used;
  }

  return { balance, credit, reserve };
})();

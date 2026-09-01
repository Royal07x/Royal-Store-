/* ==========================================================
   coupon-engine.js — Coupon Engine
   ========================================================== */

window.RS = window.RS || {};

RS.Coupons = (function () {
  const codes = [
    { code: "ROYAL10", type: "percent", value: 10, minOrder: 999 },
    { code: "WELCOME200", type: "flat", value: 200, minOrder: 1499 },
    { code: "FREESHIP", type: "shipping", value: 0, minOrder: 0 }
  ];

  function find(code) {
    return codes.find((c) => c.code === (code || "").toUpperCase()) || null;
  }

  // Returns the discount amount in rupees for a given subtotal.
  function apply(code, subtotal) {
    const coupon = find(code);
    if (!coupon) throw new Error("Invalid coupon code.");
    if (subtotal < coupon.minOrder) {
      throw new Error(`Add ₹${coupon.minOrder - subtotal} more to use ${coupon.code}.`);
    }
    if (coupon.type === "percent") return Math.round((subtotal * coupon.value) / 100);
    if (coupon.type === "flat") return coupon.value;
    return 0; // shipping coupons are handled as a delivery-fee waiver in checkout.js
  }

  function list() {
    return codes.slice();
  }

  return { apply, find, list };
})();

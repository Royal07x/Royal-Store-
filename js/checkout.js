/* ==========================================================
   checkout.js — Buy Now / Checkout
   Buy Now requires login (locked feature); Add To Cart does not.
   ========================================================== */

window.RS = window.RS || {};

RS.Checkout = (function () {
  function requireAuthOrRedirect() {
    return RS.Auth.requireLogin("cart.html");
  }

  async function placeOrder({ address, paymentMethod, couponCode }) {
    if (!requireAuthOrRedirect()) return null;

    const user = RS.Auth.currentUser();
    const items = RS.Cart.detailedItems();
    if (!items.length) throw new Error("Your cart is empty.");

    let subtotal = RS.Cart.subtotal();
    let discount = 0;
    if (couponCode) {
      discount = RS.Coupons.apply(couponCode, subtotal);
    }

    const deliveryFee = subtotal > 3000 ? 0 : 149;
    const walletUsed = RS.Wallet ? RS.Wallet.reserve(subtotal - discount + deliveryFee) : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee - walletUsed);

    const order = {
      id: "ORD" + Date.now(),
      userId: user.id,
      items: items.map((i) => ({ productId: i.productId, name: i.product.name, price: i.product.price, qty: i.qty })),
      address,
      paymentMethod,
      couponCode: couponCode || null,
      subtotal,
      discount,
      deliveryFee,
      walletUsed,
      total,
      status: "confirmed",
      placedAt: new Date().toISOString()
    };

    await RS.Orders.create(order);
    RS.Invoice && RS.Invoice.generate(order);
    RS.Cart.clear();
    return order;
  }

  return { placeOrder, requireAuthOrRedirect };
})();

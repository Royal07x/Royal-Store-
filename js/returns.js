/* ==========================================================
   returns.js — Return System
   Requests a return on a delivered order and, once approved,
   credits the refund to the user's wallet.
   ========================================================== */

window.RS = window.RS || {};

RS.Returns = (function () {
  const KEY = "returns";

  function list() {
    return RS.DB.read(KEY, []);
  }

  async function request(orderId, reason) {
    const order = await RS.Orders.getById(orderId);
    if (!order) throw new Error("Order not found.");
    const returns = list();
    const entry = {
      id: "RET" + Date.now(),
      orderId,
      reason: RS.Security.sanitize(reason || ""),
      amount: order.total,
      status: "requested",
      requestedAt: new Date().toISOString()
    };
    returns.unshift(entry);
    RS.DB.write(KEY, returns);
    RS.UI && RS.UI.toast("Return request submitted", "success");
    return entry;
  }

  // In this demo, approval is instant and credits the wallet.
  function approve(returnId) {
    const returns = list();
    const entry = returns.find((r) => r.id === returnId);
    if (!entry) return null;
    entry.status = "refunded";
    RS.DB.write(KEY, returns);
    RS.Wallet.credit(entry.amount);
    return entry;
  }

  return { list, request, approve };
})();

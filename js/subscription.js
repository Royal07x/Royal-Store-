/* ==========================================================
   subscription.js — Subscription
   Royal Store+ membership: free delivery and early access.
   ========================================================== */

window.RS = window.RS || {};

RS.Subscription = (function () {
  const plans = [
    { id: "monthly", name: "Royal+ Monthly", price: 149, perks: ["Free delivery", "Early access to drops"] },
    { id: "yearly", name: "Royal+ Yearly", price: 1299, perks: ["Free delivery", "Early access to drops", "2 months free"] }
  ];

  function key(userId) {
    return "subscription:" + userId;
  }

  function current() {
    const user = RS.Auth.currentUser();
    if (!user) return null;
    return RS.DB.read(key(user.id), null);
  }

  function subscribe(planId) {
    const user = RS.Auth.currentUser();
    if (!user) throw new Error("Please log in to subscribe.");
    const plan = plans.find((p) => p.id === planId);
    if (!plan) throw new Error("Unknown plan.");
    const record = { planId, startedAt: new Date().toISOString() };
    RS.DB.write(key(user.id), record);
    RS.UI && RS.UI.toast(`Subscribed to ${plan.name}`, "success");
    return record;
  }

  function cancel() {
    const user = RS.Auth.currentUser();
    if (user) RS.DB.remove(key(user.id));
  }

  return { plans, current, subscribe, cancel };
})();

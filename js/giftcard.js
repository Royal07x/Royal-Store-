/* ==========================================================
   giftcard.js — Gift Card
   ========================================================== */

window.RS = window.RS || {};

RS.GiftCard = (function () {
  const KEY = "giftcards";

  function list() {
    return RS.DB.read(KEY, []);
  }

  function issue(amount, recipientEmail) {
    const cards = list();
    const card = {
      code: "GC-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
      amount,
      balance: amount,
      recipientEmail: recipientEmail || null,
      issuedAt: new Date().toISOString()
    };
    cards.push(card);
    RS.DB.write(KEY, cards);
    return card;
  }

  function redeem(code) {
    const card = list().find((c) => c.code === (code || "").toUpperCase());
    if (!card || card.balance <= 0) throw new Error("Invalid or empty gift card.");
    const amount = card.balance;
    card.balance = 0;
    RS.DB.write(KEY, list().map((c) => (c.code === card.code ? card : c)));
    RS.Wallet.credit(amount);
    return amount;
  }

  return { list, issue, redeem };
})();

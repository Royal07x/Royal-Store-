/* ==========================================================
   seller.js — Seller Panel
   Lets a signed-in user list their own products for sale.
   Basic version: local to this browser only.
   ========================================================== */

window.RS = window.RS || {};

RS.Seller = (function () {
  const KEY = "sellerListings";

  function listings() {
    return RS.DB.read(KEY, []);
  }

  function myListings() {
    const user = RS.Auth.currentUser();
    if (!user) return [];
    return listings().filter((l) => l.sellerId === user.id);
  }

  function addListing({ name, price, category, description }) {
    const user = RS.Auth.currentUser();
    if (!user) throw new Error("Please log in as a seller first.");
    const all = listings();
    const item = {
      id: "sl" + Date.now(),
      sellerId: user.id,
      name: RS.Security.sanitize(name),
      price: Number(price) || 0,
      category: category || "misc",
      description: RS.Security.sanitize(description || ""),
      status: "pending-review",
      createdAt: new Date().toISOString()
    };
    all.push(item);
    RS.DB.write(KEY, all);
    return item;
  }

  function removeListing(id) {
    RS.DB.write(KEY, listings().filter((l) => l.id !== id));
  }

  return { listings, myListings, addListing, removeListing };
})();

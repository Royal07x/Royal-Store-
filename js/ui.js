/* ==========================================================
   ui.js — UI Controls
   Loader, toast notifications, the iPhone-style popup, and
   the mobile nav. Every page includes this after app.js.
   ========================================================== */

window.RS = window.RS || {};

RS.UI = (function () {
  function hideLoader() {
    const loader = document.querySelector(".rs-loader");
    if (!loader) return;
    loader.classList.add("is-hidden");
    setTimeout(() => loader.remove(), 500);
  }

  function toast(message, type) {
    let host = document.querySelector(".toast-stack");
    if (!host) {
      host = document.createElement("div");
      host.className = "toast-stack";
      document.body.appendChild(host);
    }
    const el = document.createElement("div");
    el.className = "toast" + (type === "success" || type === "error" ? " toast--" + type : "");
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => el.remove(), 2800);
  }

  function toggleMobileMenu(force) {
    const menu = document.querySelector(".mobile-menu");
    const scrim = document.querySelector(".scrim");
    if (!menu) return;
    const open = force !== undefined ? force : !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open);
    if (scrim) scrim.classList.toggle("is-visible", open);
  }

  function showIphonePopup() {
    if (RS.DB.read("popupSeen", false)) return;
    const popup = document.querySelector(".popup-card");
    const scrim = document.querySelector(".popup-scrim");
    if (!popup) return;
    setTimeout(() => {
      popup.classList.add("is-open");
      if (scrim) scrim.classList.add("is-visible");
    }, 1200);
  }

  function closeIphonePopup() {
    const popup = document.querySelector(".popup-card");
    const scrim = document.querySelector(".popup-scrim");
    if (popup) popup.classList.remove("is-open");
    if (scrim) scrim.classList.remove("is-visible");
    RS.DB.write("popupSeen", true);
  }

  function updateBadges() {
    document.querySelectorAll("[data-cart-count]").forEach((el) => (el.textContent = RS.Cart.count()));
    document.querySelectorAll("[data-wishlist-count]").forEach((el) => (el.textContent = RS.Wishlist.count()));
  }

  function bindGlobalUI() {
    document.querySelectorAll("[data-menu-toggle]").forEach((btn) =>
      btn.addEventListener("click", () => toggleMobileMenu())
    );
    document.querySelectorAll("[data-menu-close], .scrim").forEach((btn) =>
      btn.addEventListener("click", () => toggleMobileMenu(false))
    );
    document.querySelectorAll("[data-popup-close]").forEach((btn) =>
      btn.addEventListener("click", closeIphonePopup)
    );
    document.addEventListener("rs:cart-changed", updateBadges);
    document.addEventListener("rs:wishlist-changed", updateBadges);
    updateBadges();
  }

  return { hideLoader, toast, toggleMobileMenu, showIphonePopup, closeIphonePopup, updateBadges, bindGlobalUI };
})();

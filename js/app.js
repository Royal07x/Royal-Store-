/* ==========================================================
   app.js — Main Application
   Loaded last on every page. Boots the modules every page
   needs regardless of which one it is.
   ========================================================== */

window.RS = window.RS || {};

RS.App = (function () {
  function renderAuthState() {
    const user = RS.Auth.currentUser();
    document.querySelectorAll("[data-auth-name]").forEach((el) => {
      el.textContent = user ? user.name : "Sign in";
    });
    document.querySelectorAll("[data-auth-only]").forEach((el) => {
      el.style.display = user ? "" : "none";
    });
    document.querySelectorAll("[data-guest-only]").forEach((el) => {
      el.style.display = user ? "none" : "";
    });
    document.querySelectorAll("[data-logout]").forEach((btn) =>
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        RS.Auth.logout();
        window.location.href = "index.html";
      })
    );
  }

  function init() {
    RS.Performance.markLoaded();
    RS.Affiliate.captureReferralFromURL();
    RS.UI.bindGlobalUI();
    RS.Search.bind("[data-search-input]", "[data-search-results]");
    renderAuthState();
    RS.UI.showIphonePopup();
    RS.Performance.lazyLoadImages();
    window.addEventListener("load", RS.UI.hideLoader);
    // Fallback in case the load event already fired before this ran.
    if (document.readyState === "complete") RS.UI.hideLoader();
  }

  document.addEventListener("DOMContentLoaded", init);

  return { init, renderAuthState };
})();

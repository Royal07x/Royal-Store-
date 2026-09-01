/* ==========================================================
   affiliate.js — Affiliate
   Generates a referral link/code and tracks credited signups
   in this browser (basic, local-only demo).
   ========================================================== */

window.RS = window.RS || {};

RS.Affiliate = (function () {
  function codeFor(user) {
    return "REF-" + user.id.replace(/\W/g, "").slice(-6).toUpperCase();
  }

  function myCode() {
    const user = RS.Auth.currentUser();
    if (!user) return null;
    return codeFor(user);
  }

  function myLink() {
    const code = myCode();
    if (!code) return null;
    return `${window.location.origin}${window.location.pathname.replace(/[^/]*$/, "")}index.html?ref=${code}`;
  }

  function captureReferralFromURL() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) RS.DB.write("referredBy", ref);
  }

  function stats() {
    const user = RS.Auth.currentUser();
    if (!user) return { code: null, referrals: 0 };
    const referrals = RS.DB.read("referrals:" + user.id, 0);
    return { code: codeFor(user), referrals };
  }

  return { myCode, myLink, captureReferralFromURL, stats };
})();

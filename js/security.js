/* ==========================================================
   security.js — Security Helpers
   Client-side hygiene only. A real deployment must repeat
   these checks server-side; nothing here should be trusted
   as the sole line of defense.
   ========================================================== */

window.RS = window.RS || {};

RS.Security = (function () {
  function sanitize(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  }

  function passwordStrength(pw) {
    pw = pw || "";
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return ["Too weak", "Weak", "Fair", "Good", "Strong"][score];
  }

  // Simple non-cryptographic hash so demo passwords are never
  // stored in localStorage as plain text. NOT for production use.
  function hash(str) {
    let h = 0;
    str = str || "";
    for (let i = 0; i < str.length; i++) {
      h = (h << 5) - h + str.charCodeAt(i);
      h |= 0;
    }
    return "h" + Math.abs(h).toString(36);
  }

  return { sanitize, isValidEmail, passwordStrength, hash };
})();

/* ==========================================================
   database.js — Local Database Layer
   Royal Store has no server, so this module is the single
   place that touches localStorage. Every other module reads
   and writes through RS.DB instead of calling localStorage
   directly, so it stays easy to swap for a real backend later.
   ========================================================== */

window.RS = window.RS || {};

RS.DB = (function () {
  const PREFIX = "royalstore:";

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.warn("RS.DB read failed for", key, e);
      return fallback;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn("RS.DB write failed for", key, e);
      return false;
    }
  }

  function remove(key) {
    localStorage.removeItem(PREFIX + key);
  }

  function allKeys() {
    return Object.keys(localStorage).filter((k) => k.startsWith(PREFIX));
  }

  return { read, write, remove, allKeys, PREFIX };
})();

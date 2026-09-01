/* ==========================================================
   backup.js — Backup
   Exports every RS.DB-namespaced key as a downloadable JSON
   file, and can restore from one. Useful before clearing
   browser storage, or moving data to another browser.
   ========================================================== */

window.RS = window.RS || {};

RS.Backup = (function () {
  function exportAll() {
    const dump = {};
    RS.DB.allKeys().forEach((k) => {
      dump[k.replace(RS.DB.PREFIX, "")] = JSON.parse(localStorage.getItem(k));
    });
    const blob = new Blob([JSON.stringify(dump, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `royal-store-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function restoreFrom(json) {
    const data = typeof json === "string" ? JSON.parse(json) : json;
    Object.keys(data).forEach((key) => RS.DB.write(key, data[key]));
    RS.UI && RS.UI.toast("Backup restored", "success");
  }

  return { exportAll, restoreFrom };
})();

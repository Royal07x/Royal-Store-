/* ==========================================================
   cloudsync.js — Cloud Sync
   Basic version has no real server, so this queues changes
   and reports them as "synced" locally. Swap queueSync's body
   for a real fetch() call to enable true multi-device sync.
   ========================================================== */

window.RS = window.RS || {};

RS.CloudSync = (function () {
  const QUEUE_KEY = "syncQueue";

  function queueSync(resource) {
    const queue = RS.DB.read(QUEUE_KEY, []);
    queue.push({ resource, queuedAt: new Date().toISOString() });
    RS.DB.write(QUEUE_KEY, queue);
    // Simulate an async sync completing shortly after.
    setTimeout(() => flushOne(), 400);
  }

  function flushOne() {
    const queue = RS.DB.read(QUEUE_KEY, []);
    if (!queue.length) return;
    queue.shift();
    RS.DB.write(QUEUE_KEY, queue);
  }

  function pendingCount() {
    return RS.DB.read(QUEUE_KEY, []).length;
  }

  return { queueSync, pendingCount };
})();

/* ==========================================================
   performance.js — Performance
   Lazy-loads offscreen images and logs a basic load-time
   mark to the console for debugging.
   ========================================================== */

window.RS = window.RS || {};

RS.Performance = (function () {
  function lazyLoadImages() {
    const targets = document.querySelectorAll("img[data-src]");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((img) => (img.src = img.dataset.src));
      return;
    }
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
          obs.unobserve(img);
        }
      });
    });
    targets.forEach((img) => observer.observe(img));
  }

  function markLoaded() {
    window.addEventListener("load", () => {
      const t = performance.now();
      console.log(`Royal Store: page ready in ${Math.round(t)}ms`);
    });
  }

  return { lazyLoadImages, markLoaded };
})();

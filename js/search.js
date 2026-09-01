/* ==========================================================
   search.js — Search
   Wires up the header search box to RS.Products.search and
   renders a lightweight results dropdown.
   ========================================================== */

window.RS = window.RS || {};

RS.Search = (function () {
  function bind(inputSelector, resultsSelector) {
    const input = document.querySelector(inputSelector);
    const results = document.querySelector(resultsSelector);
    if (!input || !results) return;

    input.addEventListener("input", () => {
      const query = input.value;
      if (!query.trim()) {
        results.innerHTML = "";
        results.classList.remove("rs-search-results--open");
        return;
      }
      const matches = RS.Products.search(query).slice(0, 6);
      renderResults(results, matches);
    });

    document.addEventListener("click", (e) => {
      if (!results.contains(e.target) && e.target !== input) {
        results.classList.remove("rs-search-results--open");
      }
    });
  }

  function renderResults(container, matches) {
    if (!matches.length) {
      container.innerHTML = `<p class="rs-search-empty">No products found</p>`;
    } else {
      container.innerHTML = matches
        .map(
          (p) => `<a class="rs-search-item" href="index.html#product-${p.id}">
                    <span>${p.name}</span><span>₹${p.price}</span>
                  </a>`
        )
        .join("");
    }
    container.classList.add("rs-search-results--open");
  }

  return { bind };
})();

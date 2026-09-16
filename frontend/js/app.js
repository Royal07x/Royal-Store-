(() => {
  const header = document.querySelector('#site-header');
  const toast = document.querySelector('.toast');
  const menuButton = document.querySelector('.menu-button');
  const showToast = (message) => { if (!toast) return; toast.textContent = message; toast.setAttribute('aria-hidden','false'); toast.classList.add('show'); window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => { toast.classList.remove('show'); toast.setAttribute('aria-hidden','true'); }, 2200); };
  window.showRoyalToast = showToast;
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 12), { passive: true });
  menuButton?.addEventListener('click', () => { const expanded = menuButton.getAttribute('aria-expanded') === 'true'; menuButton.setAttribute('aria-expanded', String(!expanded)); showToast(expanded ? 'Menu closed' : 'Mobile menu foundation ready'); });
})();

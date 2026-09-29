(() => {
  const header = document.querySelector('#site-header');
  const toast = document.querySelector('.toast');
  const menuButton = document.querySelector('.menu-button');
  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.setAttribute('aria-hidden','false');
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden','true');
    }, 2200);
  };
  window.showRoyalToast = showToast;
  window.addEventListener('scroll', () => header?.classList.toggle('scrolled', window.scrollY > 12), { passive: true });
  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    showToast(expanded ? 'Menu closed' : 'Mobile menu foundation ready');
  });

  const cartButton = [...document.querySelectorAll('.icon-button')]
    .find((button) => button.getAttribute('aria-label') === 'Shopping cart');
  cartButton?.addEventListener('click', () => { location.href = './cart.html'; });

  const API_BASE = (window.ROYAL_STORE_API_BASE || '').replace(/\/$/, '');
  const token = sessionStorage.getItem('royal_store_access_token');
  const badge = cartButton?.querySelector('.badge');
  if (badge && token) {
    fetch(API_BASE + '/api/cart', {
      headers: { Accept: 'application/json', Authorization: 'Bearer ' + token }
    }).then(async (response) => {
      if (!response.ok) return;
      const payload = await response.json();
      const count = (payload.data?.cart?.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0);
      badge.textContent = count > 99 ? '99+' : String(count);
      badge.hidden = count === 0;
    }).catch(() => {});
  }
})();

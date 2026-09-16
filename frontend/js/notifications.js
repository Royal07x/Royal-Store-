import { authFetch, isLoggedIn } from './auth.js';

const message = document.querySelector('#message');
const list = document.querySelector('#notifications');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

if (!isLoggedIn()) {
  location.href = `./auth.html?next=${encodeURIComponent('./notifications.html')}`;
} else {
  const load = async () => {
    try {
      const response = await authFetch('/api/notifications');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load notifications.');
      const items = data.notifications || [];
      message.textContent = items.length ? '' : 'You have no notifications yet.';
      list.innerHTML = items.map((item) => `<article class="glass" style="padding:16px;display:grid;gap:6px;opacity:${item.read ? '0.72' : '1'}"><strong>${esc(item.title)}</strong><span>${esc(item.message)}</span><small>${esc(new Date(item.createdAt).toLocaleString())}${item.read ? ' • Read' : ''}</small>${item.read ? '' : `<button class="secondary-button" data-read="${esc(item._id)}" type="button">Mark as read</button>`}</article>`).join('');
    } catch (error) { message.textContent = error.message; }
  };
  list.addEventListener('click', async (event) => {
    const id = event.target.dataset.read;
    if (!id) return;
    event.target.disabled = true;
    try {
      const response = await authFetch(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'PATCH' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not update notification.');
      await load();
    } catch (error) { message.textContent = error.message; event.target.disabled = false; }
  });
  load();
}

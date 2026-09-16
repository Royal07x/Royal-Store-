import { authFetch, isLoggedIn } from './auth.js';

const form = document.querySelector('#ticket-form');
const message = document.querySelector('#message');
const list = document.querySelector('#tickets');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

if (!isLoggedIn()) {
  location.href = `./auth.html?next=${encodeURIComponent('./support.html')}`;
} else {
  const load = async () => {
    try {
      const response = await authFetch('/api/support');
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load support tickets.');
      const tickets = data.tickets || [];
      list.innerHTML = tickets.length ? tickets.map((ticket) => `<article class="glass" style="padding:16px;display:grid;gap:6px"><strong>${esc(ticket.subject)}</strong><span>${esc(ticket.message)}</span><small>Status: ${esc(ticket.status)} • ${esc(new Date(ticket.createdAt).toLocaleString())}</small>${ticket.adminReply ? `<p><strong>Support reply:</strong> ${esc(ticket.adminReply)}</p>` : '<small>Waiting for a support reply.</small>'}</article>`).join('') : '<p>No support tickets yet.</p>';
      message.textContent = '';
    } catch (error) { message.textContent = error.message; }
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = form.querySelector('button');
    button.disabled = true;
    message.textContent = 'Creating support ticket…';
    try {
      const body = Object.fromEntries(new FormData(form));
      const response = await authFetch('/api/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not create ticket.');
      form.reset();
      message.textContent = 'Support ticket created successfully.';
      await load();
    } catch (error) { message.textContent = error.message; }
    finally { button.disabled = false; }
  });
  load();
}

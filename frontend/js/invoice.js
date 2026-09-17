import { authFetch, isLoggedIn } from './auth.js';

const root = document.querySelector('#invoice');
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
const orderId = new URLSearchParams(location.search).get('order');

if (!isLoggedIn()) location.href = `./auth.html?next=${encodeURIComponent(`./invoice.html?order=${orderId || ''}`)}`;
else if (!orderId) root.innerHTML = '<p>Order ID is missing.</p>';
else {
  try {
    const response = await authFetch(`/api/invoices/${encodeURIComponent(orderId)}`);
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Could not load invoice.');
    const { invoice, order } = data;
    root.innerHTML = `<div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:16px"><button class="primary-button" id="print" type="button">Print / Save PDF</button></div><p class="eyebrow">ROYAL STORE V2 • INVOICE</p><h1>Invoice ${esc(invoice.invoiceNumber)}</h1><p>Issued ${esc(new Date(invoice.issuedAt).toLocaleString())}</p><hr><h2>Order ${esc(order.orderNumber)}</h2><p><strong>Ship to:</strong> ${esc(order.shippingAddress.fullName)}<br>${esc(order.shippingAddress.line1)}<br>${esc(order.shippingAddress.city)}, ${esc(order.shippingAddress.state)} ${esc(order.shippingAddress.postalCode)}<br>${esc(order.shippingAddress.country)}</p><div style="display:grid;gap:8px;margin-top:20px">${order.items.map((item) => `<div style="display:flex;justify-content:space-between;gap:12px"><span>${esc(item.name)} × ${esc(item.quantity)}</span><strong>${money(item.lineTotal)}</strong></div>`).join('')}</div><hr><p>Subtotal: ${money(invoice.subtotal)}</p><p>Discount: −${money(invoice.discount)}</p><p>Shipping: ${money(invoice.shippingFee)}</p><h2>Total: ${money(invoice.total)}</h2><p>Payment status: ${esc(order.paymentStatus)} • Currency: ${esc(invoice.currency)}</p>`;
    document.querySelector('#print')?.addEventListener('click', () => window.print());
  } catch (error) { root.innerHTML = `<p role="alert">${esc(error.message)}</p>`; }
}

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
    if (!response.ok) throw new Error(data.message || 'Could not load receipt.');
    const { invoice, order } = data;
    const title = invoice.documentType === 'invoice' ? 'Invoice' : 'Order Receipt';
    const paymentText = order.paymentStatus === 'paid'
      ? `Paid via ${String(order.paymentMethod || 'cod').toUpperCase()}`
      : order.paymentMethod === 'cod'
        ? 'Cash on Delivery — payment due at delivery'
        : `Payment status: ${String(order.paymentStatus || 'pending')}`;
    const items = (invoice.items?.length ? invoice.items : order.items);
    const address = invoice.shippingAddress || order.shippingAddress;
    root.innerHTML = `<div class="no-print" style="display:flex;justify-content:flex-end;margin-bottom:16px"><button class="primary-button" id="print" type="button">Print / Save PDF</button></div><p class="eyebrow">ROYAL STORE V2 • ${esc(title.toUpperCase())}</p><h1>${esc(title)} ${esc(invoice.invoiceNumber)}</h1><p>Issued ${esc(new Date(invoice.issuedAt).toLocaleString())}</p><hr><h2>Order ${esc(order.orderNumber)}</h2><p><strong>Ship to:</strong> ${esc(address.fullName)}<br>${esc(address.line1)}${address.line2 ? `<br>${esc(address.line2)}` : ''}<br>${esc(address.city)}, ${esc(address.state)} ${esc(address.postalCode)}<br>${esc(address.country)}</p><div style="display:grid;gap:8px;margin-top:20px">${items.map((item) => `<div style="display:flex;justify-content:space-between;gap:12px"><span>${esc(item.name)} × ${esc(item.quantity)}</span><strong>${money(item.lineTotal)}</strong></div>`).join('')}</div><hr><p>Subtotal: ${money(invoice.subtotal)}</p><p>Discount: −${money(invoice.discount)}</p><p>Shipping: ${money(invoice.shippingFee)}</p><h2>Total: ${money(invoice.total)}</h2><p>${esc(paymentText)} • Currency: ${esc(invoice.currency)}</p>`;
    document.querySelector('#print')?.addEventListener('click', () => window.print());
  } catch (error) { root.innerHTML = `<p role="alert">${esc(error.message)}</p>`; }
}

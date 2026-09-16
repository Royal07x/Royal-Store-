import { authFetch, isLoggedIn } from './auth.js';
const orderId = new URLSearchParams(location.search).get('order');
const status = document.querySelector('#payment-status');
const qrImage = document.querySelector('#qr-image');
const qrBox = document.querySelector('#qr-box');
const createQrButton = document.querySelector('#create-qr');
const verifyButton = document.querySelector('#verify-payment');
let paymentId = null;
const message = (text) => { status.textContent = text; };
if (!isLoggedIn()) { location.href = `./auth.html?next=${encodeURIComponent(`./payment.html?order=${orderId || ''}`)}`; }
else if (!orderId) { message('Order ID is missing.'); createQrButton.disabled = true; }
createQrButton?.addEventListener('click', async () => {
  createQrButton.disabled = true; message('Creating a fresh payment QR…');
  try {
    const response = await authFetch(`/api/payments/orders/${encodeURIComponent(orderId)}/qr`, { method: 'POST' });
    const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'Could not create payment QR.');
    paymentId = payload.data.payment.id;
    const url = payload.data.payment.qrImageUrl;
    if (!url) throw new Error('Payment gateway did not return a QR image.');
    qrImage.src = url; qrImage.hidden = false; qrBox.hidden = false; verifyButton.disabled = false;
    message('Scan the QR with your supported UPI app, then check payment.');
  } catch (error) { message(error.message); createQrButton.disabled = false; }
});
verifyButton?.addEventListener('click', async () => {
  if (!paymentId) return; verifyButton.disabled = true; message('Checking payment status…');
  try {
    const response = await authFetch(`/api/payments/${encodeURIComponent(paymentId)}`); const payload = await response.json();
    if (!response.ok) throw new Error(payload.message || 'Could not check payment.');
    const payment = payload.data.payment;
    if (payment.status === 'paid') { message('Payment confirmed successfully.'); setTimeout(() => { location.href = `./orders.html?order=${encodeURIComponent(orderId)}`; }, 600); return; }
    if (payment.status === 'expired' || payment.status === 'failed') { message(`Payment ${payment.status}. Create a new QR to retry.`); createQrButton.disabled = false; return; }
    message('Payment is still pending. Wait a moment and check again.');
  } catch (error) { message(error.message); } finally { verifyButton.disabled = false; }
});

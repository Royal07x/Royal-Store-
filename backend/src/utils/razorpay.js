import crypto from 'node:crypto';
import { env } from '../config/env.js';

const baseUrl = 'https://api.razorpay.com/v1';

function authHeader() {
  if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) throw new Error('Razorpay credentials are not configured.');
  return `Basic ${Buffer.from(`${env.RAZORPAY_KEY_ID}:${env.RAZORPAY_KEY_SECRET}`).toString('base64')}`;
}

async function razorpayRequest(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, { ...options, headers: { Authorization: authHeader(), 'Content-Type': 'application/json', ...(options.headers || {}) } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) { const error = new Error(body?.error?.description || 'Razorpay request failed.'); error.statusCode = response.status; throw error; }
  return body;
}

export function createRazorpayOrder({ amount, receipt }) { return razorpayRequest('/orders', { method: 'POST', body: JSON.stringify({ amount, currency: 'INR', receipt, partial_payment: false }) }); }
export function createDynamicQr({ amount, description, closeBy }) { return razorpayRequest('/payments/qr_codes', { method: 'POST', body: JSON.stringify({ type: 'upi_qr', name: 'Royal Store V2', usage: 'single_use', fixed_amount: true, payment_amount: amount, description, close_by: closeBy }) }); }
export function fetchQr(qrId) { return razorpayRequest(`/payments/qr_codes/${encodeURIComponent(qrId)}`); }
export function closeQr(qrId) { return razorpayRequest(`/payments/qr_codes/${encodeURIComponent(qrId)}/close`, { method: 'POST', body: '{}' }); }

function safeEqualHex(a, b) {
  const left = Buffer.from(String(a), 'utf8');
  const right = Buffer.from(String(b), 'utf8');
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export function verifyPaymentSignature({ orderId, paymentId, signature }) {
  if (!env.RAZORPAY_KEY_SECRET || !orderId || !paymentId || !signature) return false;
  const generated = crypto.createHmac('sha256', env.RAZORPAY_KEY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');
  return safeEqualHex(generated, signature);
}

export function verifyWebhookSignature(rawBody, signature) {
  if (!env.RAZORPAY_WEBHOOK_SECRET || !signature) return false;
  const generated = crypto.createHmac('sha256', env.RAZORPAY_WEBHOOK_SECRET).update(rawBody).digest('hex');
  return safeEqualHex(generated, signature);
}

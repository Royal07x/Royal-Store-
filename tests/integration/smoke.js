import mongoose from 'mongoose';
import { env } from '../../backend/src/config/env.js';

const required = ['MONGODB_URI', 'JWT_SECRET', 'CORS_ORIGIN'];
for (const name of required) {
  if (!env[name]) throw new Error(`${name} is required for integration checks.`);
}

if (env.NODE_ENV === 'production') {
  throw new Error('Integration smoke checks are blocked when NODE_ENV=production.');
}

const checks = [];

async function checkMongoDB() {
  await mongoose.connect(env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 5000,
  });
  const state = mongoose.connection.readyState;
  if (state !== 1) throw new Error(`MongoDB connection state is ${state}, expected 1.`);
  checks.push('MongoDB connection');
}

async function checkRazorpayTestMode() {
  const { RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET } = env;
  if (!RAZORPAY_KEY_ID && !RAZORPAY_KEY_SECRET) {
    console.log('Razorpay: skipped (Test Mode credentials not configured).');
    return;
  }
  if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
    throw new Error('Both RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required when Razorpay is configured.');
  }
  if (!RAZORPAY_KEY_ID.startsWith('rzp_test_')) {
    throw new Error('Integration checks require a Razorpay Test Mode key (rzp_test_...).');
  }

  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const response = await fetch('https://api.razorpay.com/v1/orders?count=1', {
    headers: { Authorization: `Basic ${auth}` },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) {
    throw new Error(`Razorpay Test Mode check failed with HTTP ${response.status}.`);
  }
  checks.push('Razorpay Test Mode API');
}

try {
  await checkMongoDB();
  await checkRazorpayTestMode();
  console.log(`Integration smoke checks passed: ${checks.join(', ') || 'configuration-only'}.`);
} finally {
  await mongoose.disconnect().catch(() => {});
}

import express from 'express';
import { fileURLToPath } from 'node:url';
import apiRoutes from './routes/api.routes.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import { requestMetrics } from './middleware/metrics.js';
import { rateLimit } from './middleware/rateLimit.js';
import healthRoutes from './routes/health.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(requestMetrics);
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use((req, res, next) => {
  const origin = req.get('origin');
  if (origin && env.CORS_ORIGIN && origin !== env.CORS_ORIGIN) return res.status(403).json({ success: false, message: 'Origin not allowed.' });
  if (origin) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Razorpay-Signature');
    res.set('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  }
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});
app.use((req, res, next) => {
  res.set('X-Content-Type-Options', 'nosniff');
  res.set('X-Frame-Options', 'DENY');
  res.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.set('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; base-uri 'none'");
  next();
});
app.use('/api/payments/webhook', express.raw({ type: 'application/json', limit: '1mb' }));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '100kb' }));
app.get('/', (_req, res) => res.json({ service: 'Royal Store V2 API', status: 'ok' }));
app.use('/api/health', healthRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api', apiRoutes);
app.use(notFound);
app.use(errorHandler);

export async function startServer() {
  await connectDatabase();
  const server = app.listen(env.PORT, () => console.log(`Royal Store API listening on port ${env.PORT}`));
  const shutdown = async (signal) => {
    console.log(`${signal}: shutting down`);
    server.close(async () => { await disconnectDatabase(); process.exit(0); });
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  return server;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  startServer().catch((error) => { console.error('Failed to start API:', error.message); process.exit(1); });
}

export { app };

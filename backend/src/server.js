import express from 'express';
import apiRoutes from './routes/api.routes.js';
import { connectDatabase, disconnectDatabase } from './config/database.js';
import { env } from './config/env.js';
import { errorHandler, notFound } from './middleware/error.js';
import healthRoutes from './routes/health.routes.js';
import categoryRoutes from './routes/category.routes.js';
import productRoutes from './routes/product.routes.js';

const app = express();
app.disable('x-powered-by');
// Webhook signature verification requires the original raw request bytes.
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

const start = async () => {
  await connectDatabase();
  const server = app.listen(env.PORT, () => console.log(`Royal Store API listening on port ${env.PORT}`));
  const shutdown = async (signal) => {
    console.log(`${signal}: shutting down`);
    server.close(async () => { await disconnectDatabase(); process.exit(0); });
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};
start().catch((error) => { console.error('Failed to start API:', error.message); process.exit(1); });
export { app };

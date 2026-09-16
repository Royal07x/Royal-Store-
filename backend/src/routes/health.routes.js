import { Router } from 'express';
import { collectHealth } from '../services/health.service.js';

const router = Router();

router.get('/', (_req, res) => {
  const health = collectHealth();
  // Public health output intentionally contains no secrets, customer data, or payment identifiers.
  res.status(health.status === 'ok' ? 200 : 503).json(health);
});

export default router;

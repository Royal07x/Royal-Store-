import { Router } from 'express';
import { databaseState } from '../config/database.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = databaseState();
  res.status(db.connected ? 200 : 503).json({
    status: db.connected ? 'ok' : 'degraded',
    services: { api: 'ok', mongodb: db.connected ? 'ok' : 'unavailable' }
  });
});

export default router;

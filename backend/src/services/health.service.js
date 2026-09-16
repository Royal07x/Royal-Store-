import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { getMetrics } from '../middleware/metrics.js';

const checkMongo = () => {
  const state = mongoose.connection.readyState;
  return { status: state === 1 ? 'ok' : 'unavailable', state };
};

const configured = (keys) => keys.every((key) => Boolean(process.env[key]));

export const collectHealth = () => {
  const metrics = getMetrics();
  const db = checkMongo();
  const razorpayReady = configured(['RAZORPAY_KEY_ID', 'RAZORPAY_KEY_SECRET', 'RAZORPAY_WEBHOOK_SECRET']);
  const aiReady = configured(['CLOUD_AI_API_KEY', 'CLOUD_AI_BASE_URL', 'CLOUD_AI_MODEL']);
  const backup = process.env.BACKUP_LAST_SUCCESS_AT || null;
  const backupStatus = backup ? 'configured' : 'not_configured';
  const node = process.version;

  const services = {
    api: { status: 'ok', uptimeSeconds: Math.floor(process.uptime()) },
    mongodb: db,
    razorpay: { status: razorpayReady ? 'configured' : 'not_configured' },
    cloudAi: { status: aiReady ? 'configured' : 'not_configured' },
    storage: { status: 'not_configured', note: 'No object-storage adapter is configured yet.' },
    queues: { status: 'not_configured', note: 'No queue adapter is configured yet.' },
    backups: { status: backupStatus, lastSuccessAt: backup },
  };

  const degraded = Object.values(services).some((service) => service.status === 'unavailable');
  return {
    status: degraded ? 'degraded' : 'ok',
    generatedAt: new Date().toISOString(),
    environment: env.NODE_ENV,
    nodeVersion: node,
    application: { name: 'royal-store-v2', version: '0.1.0' },
    services,
    performance: metrics,
    dependencies: {
      express: '5.x',
      mongoose: '8.x',
      runtime: node,
      note: 'Exact installed versions are reported by package-lock/package manager at deployment time.'
    },
    securityConfig: {
      secretsInEnvironment: true,
      apiSecretsExposed: false,
      productionHttpsRequiredByDeployment: true,
    },
  };
};

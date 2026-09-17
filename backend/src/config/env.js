const valueOf = (name, fallback = '') => process.env[name] ?? fallback;
const required = (name) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

const nodeEnv = valueOf('NODE_ENV', 'development');
const port = Number(valueOf('PORT', '4000'));
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be a valid TCP port.');

const jwtSecret = required('JWT_SECRET');
if (nodeEnv === 'production' && jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters in production.');
}

export const env = Object.freeze({
  NODE_ENV: nodeEnv,
  PORT: port,
  MONGODB_URI: required('MONGODB_URI'),
  JWT_SECRET: jwtSecret,
  CORS_ORIGIN: valueOf('CORS_ORIGIN', 'http://localhost:5500'),
  RAZORPAY_KEY_ID: valueOf('RAZORPAY_KEY_ID'),
  RAZORPAY_KEY_SECRET: valueOf('RAZORPAY_KEY_SECRET'),
  RAZORPAY_WEBHOOK_SECRET: valueOf('RAZORPAY_WEBHOOK_SECRET'),
  CLOUD_AI_API_KEY: valueOf('CLOUD_AI_API_KEY'),
  CLOUD_AI_BASE_URL: valueOf('CLOUD_AI_BASE_URL'),
  CLOUD_AI_MODEL: valueOf('CLOUD_AI_MODEL'),
  WHATSAPP_NUMBER: valueOf('WHATSAPP_NUMBER'),
  RESET_URL: valueOf('RESET_URL', 'http://localhost:5500/reset-password.html'),
  RESET_DELIVERY_MODE: valueOf('RESET_DELIVERY_MODE', nodeEnv === 'production' ? 'email' : 'console'),
  BACKUP_LAST_SUCCESS_AT: valueOf('BACKUP_LAST_SUCCESS_AT'),
});

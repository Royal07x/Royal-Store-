import crypto from 'node:crypto';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { env } from '../config/env.js';

const TOKEN_BYTES = 32;
const TTL_MS = 15 * 60_000;

export const hashResetToken = (rawToken) => crypto.createHash('sha256').update(rawToken).digest('hex');

export async function issuePasswordReset(user) {
  await PasswordResetToken.deleteMany({ user: user._id, usedAt: null });
  const rawToken = crypto.randomBytes(TOKEN_BYTES).toString('hex');
  const expiresAt = new Date(Date.now() + TTL_MS);
  await PasswordResetToken.create({ user: user._id, tokenHash: hashResetToken(rawToken), expiresAt });

  const resetUrl = `${env.RESET_URL.replace(/\/$/, '')}#token=${encodeURIComponent(rawToken)}`;
  if (env.RESET_DELIVERY_MODE === 'console') {
    if (env.NODE_ENV === 'production') throw new Error('Console password-reset delivery is not allowed in production.');
    console.info(`[Royal Store] Development password reset URL for ${user.email}: ${resetUrl}`);
    return { delivered: true, expiresAt };
  }

  if (env.RESET_DELIVERY_MODE !== 'email') {
    throw new Error('Password reset delivery is not configured. Set RESET_DELIVERY_MODE=email and connect an email provider before production use.');
  }

  throw new Error('Email password-reset delivery adapter is not configured yet.');
}

export { TTL_MS };

import express from 'express';
import { env } from '../config/env.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { rateLimit } from '../middleware/rateLimit.js';

const router = express.Router();
const aiLimit = rateLimit({ windowMs: 60_000, max: 10 });

async function callProvider(messages) {
  if (!env.CLOUD_AI_API_KEY || !env.CLOUD_AI_BASE_URL || !env.CLOUD_AI_MODEL) return null;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(`${env.CLOUD_AI_BASE_URL.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST', signal: controller.signal,
      headers: { Authorization: `Bearer ${env.CLOUD_AI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: env.CLOUD_AI_MODEL, messages, temperature: 0.2, max_tokens: 500 }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { const error = new Error('AI provider request failed.'); error.statusCode = 502; throw error; }
    return body?.choices?.[0]?.message?.content || 'AI did not return a response.';
  } finally { clearTimeout(timer); }
}

router.post('/chat', requireAuth, aiLimit, async (req, res, next) => {
  try {
    const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!message || message.length > 2000) return res.status(400).json({ success: false, message: 'Message must be between 1 and 2000 characters.' });
    const context = req.user.role === 'admin' ? 'admin' : 'customer';
    const system = `You are Royal Store V2 ${context} support. Never ask for or reveal passwords, OTPs, API keys, payment secrets, authentication tokens, or private customer data. Give concise, safe assistance and state when a human/admin is needed.`;
    const answer = await callProvider([{ role: 'system', content: system }, { role: 'user', content: message }]);
    if (!answer) return res.status(503).json({ success: false, message: 'AI service is not configured.' });
    res.json({ success: true, data: { answer } });
  } catch (error) { next(error); }
});

router.get('/admin-check', requireAuth, requireRole('admin'), (_req, res) => res.json({ success: true, data: { access: 'admin-ai' } }));
export default router;

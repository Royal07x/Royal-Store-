import { verifyAccessToken } from '../utils/jwt.js';
import User from '../models/User.js';

export async function requireAuth(req, res, next) {
  const header = req.get('authorization');
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const payload = verifyAccessToken(header.slice(7));
    const user = await User.findById(payload.sub).select('_id name email role isActive');
    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }
    req.user = user;
    return next();
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired session.' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: 'Forbidden.' });
    }
    return next();
  };
}

const buckets = new Map();

export function rateLimit({ windowMs = 60_000, max = 60, key = (req) => req.ip || 'unknown' } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
    const bucketKey = `${key(req)}:${req.baseUrl}${req.path}`;
    const current = buckets.get(bucketKey);
    const bucket = current && current.resetAt > now ? current : { count: 0, resetAt: now + windowMs };
    bucket.count += 1;
    buckets.set(bucketKey, bucket);
    res.set('RateLimit-Limit', String(max));
    res.set('RateLimit-Remaining', String(Math.max(0, max - bucket.count)));
    res.set('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));
    if (bucket.count > max) return res.status(429).json({ success: false, message: 'Too many requests. Please try again later.' });
    next();
  };
}

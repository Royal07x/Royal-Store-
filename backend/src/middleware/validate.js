export function requireFields(fields = []) {
  return (req, res, next) => {
    const body = req.body || {};
    const missing = fields.filter((field) => typeof body[field] !== 'string' || !body[field].trim());
    if (missing.length) return res.status(400).json({ success: false, message: `Missing required field(s): ${missing.join(', ')}.` });
    next();
  };
}

export function validateObjectIdParam(name) {
  return (req, res, next) => {
    if (!/^[a-fA-F0-9]{24}$/.test(req.params?.[name] || '')) {
      return res.status(400).json({ success: false, message: `Invalid ${name}.` });
    }
    next();
  };
}

export const notFound = (_req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

export const errorHandler = (error, _req, res, _next) => {
  console.error(error);
  if (res.headersSent) return;
  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  res.status(status).json({ error: status === 500 ? 'Internal server error' : error.message });
};

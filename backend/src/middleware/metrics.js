const startedAt = Date.now();
let totalRequests = 0;
let totalErrors = 0;
let totalDurationMs = 0;

export function requestMetrics(req, res, next) {
  const started = process.hrtime.bigint();
  totalRequests += 1;
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - started) / 1e6;
    totalDurationMs += duration;
    if (res.statusCode >= 500) totalErrors += 1;
  });
  next();
}

export function getMetrics() {
  return {
    requests: totalRequests,
    serverErrors: totalErrors,
    errorRatePercent: totalRequests ? Number(((totalErrors / totalRequests) * 100).toFixed(2)) : 0,
    averageResponseMs: totalRequests ? Number((totalDurationMs / totalRequests).toFixed(2)) : 0,
    uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
  };
}

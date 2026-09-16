# Step 10 — Website Health Check

Royal Store V2 now has a defensive health-monitoring foundation.

## Public health

`GET /api/health` reports safe operational information only:
- API uptime
- MongoDB connection state
- Razorpay configuration state
- Cloud AI configuration state
- storage/queue adapter state
- backup configuration timestamp when supplied
- Node/runtime and dependency family information
- request count, server-error count, error rate, and average response time
- basic security configuration flags

The public response intentionally does not expose secrets, customer records, payment identifiers, or API credentials.

## Admin health

`GET /api/admin/health` is protected by authenticated `admin` role and returns the detailed health payload used by the admin dashboard.

## Monitoring model

The health layer distinguishes between:
- `ok`: service is operating
- `degraded`: at least one required service is unavailable
- `configured`: an optional integration has its required environment settings
- `not_configured`: an optional adapter is not connected yet

## Important limits

This is an operational health check, not an offensive vulnerability scanner. It does not attempt exploitation or unauthorized security testing.

The current metrics are in-memory process metrics and reset when the API process restarts. Persistent observability, alerting, queue/storage adapters, and production backup verification remain later hardening work.

## Next

Step 11 will harden authentication, authorization, secrets, validation, rate limits, CORS, headers, payment verification, AI authorization, uploads, logging, and recovery controls.

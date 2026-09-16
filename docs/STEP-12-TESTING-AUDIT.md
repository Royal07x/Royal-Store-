# Step 12 — Testing + Final Audit

## Automated coverage added

The project now uses Node's built-in `node:test` runner so the test suite does not require another testing framework.

Covered by automated tests:

- JWT authentication middleware rejects missing bearer authentication.
- Admin/customer role guard rejects an unauthorised role.
- API rate limiting returns HTTP 429 after the configured limit.
- Razorpay payment HMAC accepts valid signatures and rejects malformed/invalid signatures.
- Razorpay webhook HMAC verifies the exact raw request payload.
- Public health output does not expose customer data or payment identifiers and reports secrets as not exposed.
- Required frontend pages/assets exist.
- The frontend catalog contains the five approved categories only.
- Admin and AI route modules remain mounted in the API router.

## What is not claimed as fully automated yet

Live integration tests that require external infrastructure are intentionally not faked:

- MongoDB-backed signup/login, cart, wishlist and order flows.
- Live Razorpay order/QR creation, webhook delivery and payment settlement.
- Live Cloud AI provider calls.
- Real browser/mobile end-to-end interaction.
- Production HTTPS, DNS, hosting, backups and deployment smoke tests.

Those checks require a real test environment and credentials. A passing local unit/static suite must not be described as proof that those external systems have been tested.

## Running tests

```bash
npm install
npm test
```

Watch mode:

```bash
npm run test:watch
```

## Final audit rule

Do not mark Royal Store V2 as production-ready until the live integration, payment, browser, deployment and recovery checks above have been executed in a controlled test environment.

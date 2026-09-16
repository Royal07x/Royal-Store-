# Step 13B — Actual Test Environment

## Goal

Step 13B defines the controlled environment needed to verify Royal Store V2 against real services. No credentials are stored in the repository.

## Local setup

1. Install Node.js 20 or newer.
2. Clone the repository.
3. Copy `.env.example` to `.env` locally.
4. Set `MONGODB_URI` to a dedicated development/test database.
5. Set a development `JWT_SECRET`.
6. Set `CORS_ORIGIN` to the frontend origin used during testing.
7. Install dependencies with `npm install`.

## Automated tests

Run:

```bash
npm test
```

GitHub Actions now runs the same test command on pushes to `main` and pull requests targeting `main`.

## MongoDB integration check

Use a separate test database. Verify:

- database connection succeeds;
- category/product seed can run;
- signup and login work;
- authenticated user access works;
- cart and wishlist persist;
- order creation uses server-side product prices and stock.

Do not use a production database for these tests.

## Razorpay Test Mode

Configure only Test Mode credentials in the test environment:

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Verify order creation, dynamic QR creation, QR expiry, payment verification, webhook signature handling, duplicate webhook delivery, and failed-payment handling. Do not use real-money credentials during this stage.

## Cloud AI integration check

When an approved provider is configured, set:

- `CLOUD_AI_API_KEY`
- `CLOUD_AI_BASE_URL`
- `CLOUD_AI_MODEL`

Verify authenticated access, provider timeout/failure handling, rate limiting, and the no-secret/no-private-data instruction boundary.

## Frontend/API check

Serve the frontend from a local web server and point `CORS_ORIGIN` at that origin. Verify category navigation, product loading, authentication, cart, checkout and payment UI against the backend API.

## Current verification boundary

The repository has CI configuration, but this conversation environment does not provide the user's MongoDB, Razorpay or Cloud AI credentials. Therefore live external-service tests are **not claimed as executed** here. CI results must be checked after the workflow runs on GitHub.

Production deployment, HTTPS, DNS, backup/recovery and live payment testing remain separate verification gates.

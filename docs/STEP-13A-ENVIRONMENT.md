# Step 13A — Environment & Deployment Preparation

## Purpose

Step 13A prepares Royal Store V2 for controlled testing and deployment without placing credentials in Git.

## Environment variables

Use `.env.example` as the template and create a local/deployment `.env` outside version control.

### Required

- `MONGODB_URI`
- `JWT_SECRET`

In production, `JWT_SECRET` must be at least 32 characters.

### Payments — Test Mode first

- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`

Use Razorpay Test Mode credentials during Step 13 testing. Never commit these values.

### Cloud AI — optional until configured

- `CLOUD_AI_API_KEY`
- `CLOUD_AI_BASE_URL`
- `CLOUD_AI_MODEL`

The AI endpoint stays unavailable rather than pretending the service is configured when these values are missing.

### Other configuration

- `NODE_ENV`
- `PORT`
- `CORS_ORIGIN`
- `WHATSAPP_NUMBER`
- `BACKUP_LAST_SUCCESS_AT`

## Secret handling rules

1. Never put secrets in frontend JavaScript or HTML.
2. Never commit `.env` files.
3. Use GitHub/deployment-platform secret storage for hosted environments.
4. Rotate a secret immediately if it is accidentally exposed.
5. Do not use real payment credentials for development tests.

## Step 13A result

Environment configuration is centralized in `backend/src/config/env.js`. JWT utilities and authentication middleware consume the validated environment configuration. Cloud AI variables are now included in the same configuration object.

Live service connectivity is intentionally deferred to Step 13B, where the required test environment will be configured and verified.

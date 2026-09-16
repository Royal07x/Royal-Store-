# Royal Store V2

Royal Store V2 is a clean full-stack ecommerce rebuild. The repository is being built step-by-step from a locked architecture rather than extending the previous demo/static codebase.

## Project structure

- `frontend/` — customer-facing storefront
- `backend/` — server, APIs, authentication and business logic
- `admin/` — protected administration interface
- `database/` — MongoDB schemas, indexes and database documentation
- `ai/` — server-side Cloud AI integration layer
- `tests/` — automated and integration tests
- `docs/` — architecture, setup, security and operational documentation
- `.env.example` — configuration template; no secrets
- `.gitignore` — repository safety rules
- `package.json` — project metadata and scripts

## Locked build workflow

1. Project foundation
2. Frontend UI + theme
3. Five categories + products
4. Backend + MongoDB
5. Authentication + Buy Now protection
6. Cart + Wishlist + Orders
7. Razorpay + dynamic QR payment flow
8. Admin panel
9. Cloud AI module
10. Website health check
11. Security hardening
12. Testing + final audit

## Step 1 status

Foundation only. Application features are intentionally not implemented yet. Each later step will be added and checked before moving to the next step.

## Security baseline

Secrets must stay outside source control. Real payment verification, secure password handling, authorization, validation and production security controls will be implemented in their designated steps.

# Royal Store V2

Full-stack ecommerce rebuild for the Royal Store V2 project.

## Build workflow
1. Project Foundation
2. Frontend UI + Theme
3. Five approved categories + Products
4. Backend + MongoDB
5. Authentication + Buy Now Protection
6. Cart + Wishlist + Orders
7. Razorpay + Dynamic QR
8. Admin Panel
9. Cloud AI Module
10. Website Health Check
11. Security Hardening
12. Testing + Final Audit

## Step 12 status

Testing infrastructure is now present using Node's built-in `node:test` runner. The suite covers security middleware, Razorpay signature verification, public health-data safety, frontend smoke checks and approved-category integrity.

Live MongoDB, Razorpay, Cloud AI, browser, deployment and backup/recovery checks still require a controlled test environment with the relevant services configured. Therefore the project is **not** being labelled fully tested or production-ready until those checks are actually executed.

See `docs/STEP-12-TESTING-AUDIT.md` for the exact coverage and limits.

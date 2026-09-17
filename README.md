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
13. Environment & Deployment Preparation
14. Frontend ↔ Backend Integration
15. Auth + Buy Now Frontend Integration
16. Cart + Checkout + Razorpay UI/Verification
17. Coupons
18. Product Management
19. Reviews & Ratings
20. Notifications + Customer Support
21. Invoices + Order Receipt
22. Authentication Hardening — Password Reset

## Current status

The repository contains automated Node.js tests plus the core storefront/backend/admin modules listed above. Password reset now uses one-time hashed tokens with expiry, generic account-discovery responses, and JWT invalidation after a password change.

Production password-reset email delivery is intentionally not faked: a real email provider/adapter must be configured before production use. Development can use the console delivery mode.

Live MongoDB, Razorpay, Cloud AI, browser, deployment and backup/recovery checks still require a controlled test environment with the relevant services configured. Therefore the project is **not** labelled fully tested or production-ready until those checks are actually executed.

See `docs/STEP-5-AUTH.md` for password-reset details and `docs/STEP-12-TESTING-AUDIT.md` for testing limits.

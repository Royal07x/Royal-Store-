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

### Step 16 — Cart + Checkout + Payment UI/Verification
- Cart quantity controls respect server-reported stock and show update errors.
- Cart header buttons now open the cart and show the authenticated cart item count when available.
- Checkout supports both normal cart checkout and isolated Buy Now checkout.
- Checkout shows an estimated subtotal and delivery summary before submission.
- Coupon validation is connected to the server, while the order endpoint recalculates the final discount.
- COD is the only enabled payment method for the current phase.
- Before redirecting to the order page, the frontend verifies that the server returned payment method `cod` and payment status `pending`.
- Razorpay order/signature verification and dynamic QR generation remain future payment infrastructure and are not enabled in the current COD checkout.
- Live MongoDB, Razorpay and browser checks still require a controlled environment with real service credentials.

The repository contains automated Node.js tests plus the core storefront/backend/admin modules listed above. Password reset uses one-time hashed tokens with expiry, generic account-discovery responses, and JWT invalidation after a password change.

Production password-reset email delivery is intentionally not faked: a real email provider/adapter must be configured before production use. Development can use the console delivery mode.

Therefore the project is **not** labelled fully tested or production-ready until the remaining controlled-environment checks are executed.

See `docs/STEP-5-AUTH.md` for password-reset details and `docs/STEP-12-TESTING-AUDIT.md` for testing limits.

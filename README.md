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

### Step 17 — Coupons
- Customer coupon validation is authentication-protected and rate-limited.
- Coupon codes are normalized to uppercase and restricted to safe characters.
- Percent coupons cannot exceed 100%.
- Fixed coupons cannot use a max-discount field.
- Minimum subtotal, start time, expiry time and usage limit are enforced server-side.
- Order creation never trusts a client-supplied discount; the server recalculates the coupon discount from the current product subtotal.
- Coupon usage is reserved atomically against the usage limit during order creation and rolled back if stock reservation or order creation fails.
- Admin coupon CRUD is protected by the admin role.
- Admin edits validate the merged coupon state and cannot lower a usage limit below the current used count.
- Editing an inactive coupon no longer silently reactivates it.
- Invalid coupon IDs are rejected before database lookup.
- Deactivation is soft-delete style: the coupon record and usage history remain available to admins.

### Step 20 — Notifications + Customer Support
- Authenticated customers can view their own notifications and mark individual notifications as read.
- Customer support tickets are authentication-protected, rate-limited and ownership-scoped.
- Support tickets validate subject/message length and show ticket status plus admin replies.
- Admin support management is admin-only and sends a customer notification when a ticket is updated.
- When an admin reply exists, the support notification includes the reply so the customer can see the response from the notification center.
- Order creation notifications match the current COD checkout flow.
- Admin order status changes generate customer notifications when the status actually changes.
- Notification records are scoped to the owning customer; notification read updates cannot modify another customer's record.

### Step 19 — Reviews & Ratings
- Customers can submit a review only when authenticated and only against their own delivered order.
- The reviewed product must actually be present in that delivered order; the server does not trust a client-supplied purchase claim.
- Reviews accept integer ratings from 1–5 and comments from 3–1000 characters.
- Each customer can review a given product only once, enforced by both route validation and a database unique index.
- New reviews enter pending moderation and are not publicly displayed until approved.
- Public product reviews expose only approved reviews.
- Admin review moderation is protected by the admin role and supports approve/reject status plus an admin note.
- Review submission is rate-limited.
- Delivered COD orders are eligible for reviews; review eligibility is not incorrectly tied to paid payment status.
- A previously purchased product can still receive its verified review even if the product is later deactivated.

### Step 18 — Product Management
- Admin product CRUD is protected by the authenticated admin role.
- Product creation/editing validates SKU, slug, name, description, non-negative price, integer stock and image URLs.
- Products must use an active approved category before creation or category changes.
- SKU and slug uniqueness conflicts return a safe conflict response.
- Product IDs are preserved during edits so existing carts, orders and reviews continue to reference the same product.
- Deactivation is a soft status change; product records are not deleted.
- Inactive products can be explicitly reactivated through a separate status endpoint, and activation re-checks that the category is active.
- Editing product details no longer implicitly changes the product's active/inactive status.

### Step 16 — Cart + Checkout + Payment UI/Verification
- Cart quantity controls respect server-reported stock and show update errors.
- Cart header buttons open the cart and show the authenticated cart item count when available.
- Checkout supports both normal cart checkout and isolated Buy Now checkout.
- Checkout shows an estimated subtotal and delivery summary before submission.
- COD is the only enabled payment method for the current phase.
- Before redirecting to the order page, the frontend verifies that the server returned payment method `cod` and payment status `pending`.
- Razorpay order/signature verification and dynamic QR generation remain future payment infrastructure and are not enabled in the current COD checkout.
- Live MongoDB, Razorpay and browser checks still require a controlled environment with real service credentials.

### Step 21 — Invoices + Order Receipt
- Every non-cancelled customer order can open a protected printable receipt.
- Paid orders are represented as invoices; COD orders are represented as order receipts until payment is actually collected.
- Receipt records snapshot item names, SKUs, prices, quantities and shipping address so the document does not depend on later product edits.
- Access is ownership-scoped and cancelled orders are blocked.
- Gateway payment identifiers and secrets are excluded from customer-facing documents.
- Browser Print / Save PDF is supported; a server-generated PDF remains a future enhancement.

The repository contains automated Node.js tests plus the core storefront/backend/admin modules listed above. Password reset uses one-time hashed tokens with expiry, generic account-discovery responses, and JWT invalidation after a password change.

Production password-reset email delivery is intentionally not faked: a real email provider/adapter must be configured before production use. Development can use the console delivery mode.

Therefore the project is **not** labelled fully tested or production-ready until the remaining controlled-environment checks are executed.

See `docs/STEP-5-AUTH.md` for password-reset details and `docs/STEP-12-TESTING-AUDIT.md` for testing limits.

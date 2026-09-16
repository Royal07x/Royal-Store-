# Step 11 — Security Hardening

Royal Store V2 security hardening increment.

## Implemented
- Server-side JWT authentication and role checks remain mandatory for protected resources.
- Login and signup rate limiting.
- Global API rate limiting plus stricter payment/AI limits.
- Request validation helpers for required fields and ObjectId route parameters.
- Explicit CORS origin checking from `CORS_ORIGIN`.
- Security response headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, and a restrictive API CSP.
- Razorpay HMAC comparisons use length-safe timing-safe comparison.
- Payment verification now checks the Razorpay payment resource, matching order and amount before marking an order paid.
- Cloud AI requires authentication; admin context is derived from the authenticated role instead of client input.
- Secrets remain environment-only; no credentials are stored in frontend code.

## Important production notes
- The in-memory rate limiter is suitable for a single backend instance. Multi-instance production deployments should use a shared rate-limit store.
- Configure a real HTTPS production origin in `CORS_ORIGIN`.
- Use production Razorpay credentials only after completing gateway onboarding/testing.
- Security hardening does not mean the application is automatically vulnerability-free; Step 12 must run the actual test/audit suite.

## Security boundary
The health module remains defensive/operational. It is not an offensive vulnerability scanner or exploitation tool.

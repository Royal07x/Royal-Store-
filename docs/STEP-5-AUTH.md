# Step 5 — Authentication + Buy Now Protection

- Customer browsing remains public.
- Login/signup is required before Buy Now / checkout.
- Passwords are stored only as bcrypt hashes.
- Access tokens are short-lived JWTs and are never hardcoded.
- The server derives the authenticated user from the token; client-supplied user IDs are not trusted.
- Admin authorization is role-based.

## Password reset hardening

- `POST /api/auth/forgot-password` returns the same generic response whether or not the email exists.
- Reset tokens are 32 random bytes, stored only as SHA-256 hashes, and expire after 15 minutes.
- Tokens are single-use: the server atomically marks a matching unexpired token as used before changing the password.
- Reset links put the raw token in the URL fragment (`#token=...`) so it is not sent as a normal HTTP request parameter.
- After a password reset, `passwordChangedAt` invalidates older JWT sessions.
- Development can use `RESET_DELIVERY_MODE=console`; production must use a real email delivery adapter and must never expose reset tokens in API responses.

## API
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/me` (Bearer token required)

## Frontend
- `frontend/auth.html` includes the forgot-password entry point.
- `frontend/forgot-password.html` requests a reset link.
- `frontend/reset-password.html` consumes the one-time token and sets the new password.

Production email delivery remains an explicit deployment task; the repository does not pretend that a missing email provider is configured.

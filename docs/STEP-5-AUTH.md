# Step 5 — Authentication + Buy Now Protection

- Customer browsing remains public.
- Login/signup is required before Buy Now / checkout.
- Passwords are stored only as bcrypt hashes.
- Access tokens are short-lived JWTs and are never hardcoded.
- The server derives the authenticated user from the token; client-supplied user IDs are not trusted.
- Admin authorization is role-based.
- Forgot/reset password is reserved for the next auth hardening increment so reset tokens can be implemented with expiry and one-time use rather than a shortcut.

## API
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (Bearer token required)

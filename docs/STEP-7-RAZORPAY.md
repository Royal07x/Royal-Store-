# Step 7 — Razorpay Payments + Dynamic QR

Royal Store V2 now has the server-side payment foundation for Razorpay.

- Server-side Razorpay order creation.
- Payment attempts linked to Royal Store orders.
- Single-use, fixed-amount dynamic UPI QR support.
- Server-side payment signature verification.
- Signature-verified Razorpay webhooks for captured/credited payments.
- QR status checking and regeneration through a new payment attempt.
- No frontend-only payment success state.

Razorpay currently documents a minimum `close_by` window of 2 minutes and a maximum of 2 hours for single-use QR creation. The implementation requests a 2-minute window and treats Razorpay's returned expiry as authoritative.

Use Test Mode first. Keep API secrets and webhook secrets in environment variables only. QR Code availability may need to be enabled for the Razorpay account.

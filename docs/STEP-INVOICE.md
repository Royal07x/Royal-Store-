# Invoice & Order Receipt

Royal Store V2 provides a customer invoice for an order only after the order payment is marked `paid`.

## Security rules
- Invoice lookup is tied to the authenticated user and requested order.
- Unpaid orders cannot receive a customer invoice.
- Gateway payment identifiers and payment secrets are not rendered in the invoice.
- The invoice page supports browser print, which can be used to save a PDF.

## Verification
Automated tests cover owner binding, paid-order access, secret/identifier exclusion, and the invoice page print capability.

A real PDF generator can be added later if a server-generated PDF file is required; browser print-to-PDF is intentionally used for the current lightweight receipt flow.

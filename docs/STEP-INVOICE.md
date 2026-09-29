# Invoice & Order Receipt

Royal Store V2 provides a printable order receipt for every non-cancelled order owned by the authenticated customer. Paid orders are labelled as invoices; current COD orders are labelled as order receipts because payment is still due at delivery.

## Security rules
- Receipt/invoice lookup is tied to the authenticated user and requested order.
- Cancelled orders cannot receive an active receipt.
- The generated document snapshots item names, SKUs, prices, quantities and shipping address from the order.
- Gateway payment identifiers and payment secrets are not rendered in the document.
- The invoice page supports browser print, which can be used to save a PDF.

## COD handling
- COD orders can open the receipt immediately after checkout.
- The receipt clearly states that payment is due at delivery.
- This is an order receipt/confirmation, not proof that COD payment has already been collected.

## Verification
Automated tests cover owner binding, cancelled-order blocking, COD receipt creation, snapshot fields, secret/identifier exclusion, and the invoice page print capability.

A real server-generated PDF can be added later if a downloadable PDF file is required; browser print-to-PDF is intentionally used for the current lightweight receipt flow.

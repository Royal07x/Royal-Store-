# Step 6 — Cart + Wishlist + Orders

Authenticated customers can now manage a persistent server-side cart and wishlist and create/view/cancel orders.

Checkout recalculates prices and stock from MongoDB instead of trusting client totals. Payment remains `pending` until the later Razorpay integration verifies it.

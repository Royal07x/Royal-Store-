MIT License

Copyright (c) 2026 Royal Store
# Royal Store V4

Modular mobile-first static storefront.

## Run
Open `index.html` or serve with a static server. GitHub Pages ready.

## Flow
HTML → CSS layers → database/products → security/auth → cart/wishlist/orders → API/services → UI → app initialization.

## Features
Cart without login; Buy Now requires login; wishlist; orders; search/sort/categories; WhatsApp handoff; geolocation helper; coupons; wallet; invoice; seller/affiliate/subscription/gift-card modules; SEO/performance hooks.

## Production
The localStorage auth is demo-only and passwords are not securely stored. Use a backend with hashed passwords, authorization, HTTPS, real database and payment provider before production. Replace example.com in robots.txt and sitemap.xml.

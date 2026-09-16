# Step 4 — Backend + MongoDB

This step adds the server/API foundation and MongoDB data layer.

## Requirements
- Node.js 20+
- MongoDB connection string in `.env`

## Environment
Copy `.env.example` to `.env` and set `MONGODB_URI`. Never commit `.env`.

## Run API
`npm install`
`npm run dev`

## Seed development catalog
`npm run seed`

## API endpoints
- `GET /api/health`
- `GET /api/categories`
- `GET /api/categories/:slug`
- `GET /api/products`
- `GET /api/products?category=pants`
- `GET /api/products/:id`

The catalog seed is development data only. Authentication, orders, payments and admin authorization are intentionally reserved for later workflow steps.

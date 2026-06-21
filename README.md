# Odisha Pitha & Pana Marketplace

Modern full-stack e-commerce website for Odisha traditional Pithas, Panas, sweets, festival collections, and cultural food knowledge.

## Tech Stack

- Frontend: React.js, Vite, Tailwind CSS, axios, React Router
- Backend: Node.js, Express.js using ES module `import`
- Database: MySQL with `mysql2`
- Authentication: JWT
- Payments: Razorpay-ready API endpoint with demo fallback
- Image storage: product image URLs support Cloudinary or MinIO

## Features

- Home page with Odisha-inspired premium UI, generated hero food image, featured products, and festival collections
- Product catalog with search, category, festival, shelf-life, price, availability, and popularity filters
- Product details with gallery, cultural significance, ingredients, preparation, origin, nutrition, storage, manufacturing date, expiry date, shelf life, sizes, reviews, related products, cart and buy actions
- User register/login with JWT
- Cart, wishlist endpoint, checkout, payment order endpoint, order history, order tracking status, invoice data
- Knowledge hub for food history, festival significance, cooking methods, stories, and shelf-life guidance
- Admin dashboard with sales, users, orders, products, recent order analytics, and product update endpoints

## Setup

1. Install dependencies:

```bash
npm run install:all
```

2. Configure backend:

```bash
copy backend\.env.example backend\.env
```

Update MySQL values in `backend/.env`.

3. Create and seed MySQL database:

```bash
npm run seed
```

The seed script creates `odisha_pitha_marketplace`, all tables, products, reviews, knowledge posts, and demo users.

Demo logins:

- Admin: `admin@pitha.com` / `Admin@123`
- Customer: `customer@pitha.com` / `Customer@123`

4. Start backend and frontend in two terminals:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000`

## Environment Notes

- If Razorpay keys are missing, checkout uses demo mode and still creates orders.
- Set `VITE_API_URL` in `frontend/.env` if the API is not on `http://localhost:5000/api`.
- Product images are stored as URLs, so Cloudinary or MinIO URLs can be saved directly in the `image_url` field.

## Important Files

- `backend/src/schema.sql`: MySQL database schema
- `backend/src/seed.js`: database seeding
- `backend/src/server.js`: Express API
- `frontend/src/pages`: main website pages
- `frontend/src/store`: auth and cart context, no Redux
- `frontend/src/assets/odisha-pitha-hero.png`: generated local hero image

## Work Completed

- Scaffolded complete React + Tailwind frontend and Express + MySQL backend
- Added API endpoints for auth, products, product details, reviews, knowledge, cart, wishlist, payments, orders, invoices, and admin stats
- Added seeded Odisha product catalog with cultural and shelf-life metadata
- Added responsive UI with Odisha-inspired colors, motif texture, subtle hover/entry animations, and accessible controls
- Added axios integration and JWT interceptor
- Added full setup documentation for continuation in another assistant or local development

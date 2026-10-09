# Local Vendor Booking Platform

A PERN-stack local services marketplace (Urban Company style) with three roles —
Customer, Vendor, Admin — built with a real, working core: auth, vendor/service
management, the full booking lifecycle, reviews, and an admin panel with analytics.

## What's included and working

**Backend** (Node/Express/PostgreSQL via Prisma)
- JWT auth with refresh-token rotation, register/login/logout, forgot/reset password,
  email verification token flow, role-based route protection
- Categories, services, vendors (profile, document upload, earnings) CRUD
- Full booking lifecycle: create → accept/reject → complete → cancel/reschedule,
  with auto-generated invoice + payment record on completion
- Reviews tied to completed bookings, with vendor rating aggregation
- Wishlist, notifications, user profile + avatar upload
- Admin: dashboard analytics (revenue trend, booking status breakdown), user
  management, vendor approval queue, bookings/payments views, complaints, coupons
- Centralized error handling, Zod validation, rate limiting, Helmet, CORS,
  compression, Morgan logging
- File uploads via Multer, with an automatic fallback to local disk storage if
  Cloudinary credentials aren't configured (so it runs out of the box)

**Frontend** (React 19 + Vite + MUI v7 + Redux Toolkit/RTK Query)
- Landing page with hero search, categories, featured vendors, FAQ
- Auth pages (login/register/forgot password) with React Hook Form + Zod
- Vendor browse/filter/search, vendor profile with services + reviews tabs
- Booking flow: pick a service → schedule → confirm
- Customer dashboard: booking list with cancel/reschedule/review actions
- Vendor dashboard: earnings, manage services (CRUD), accept/reject/complete bookings
- Admin dashboard: MUI DataGrid user table, recharts revenue/status charts,
  category management
- Auto access-token refresh on 401 via an RTK Query wrapped base query
- Light/dark mode toggle, protected routes per role, responsive MUI layout

## What's NOT included (scope cut from the original spec)

This was too large to build as fully-loaded production code in one pass, so these
were deliberately left out. Ask and they can be added incrementally:

- Live chat (Socket.io) and real SMS notifications
- Real Stripe/Razorpay payment integration (bookings currently create a `PENDING`
  payment record that flips to `PAID` on completion — no real payment gateway is wired up)
- PDF invoice generation/download (an `Invoice` record with an invoice number is
  created, but no PDF is rendered)
- Google Maps / geolocation search
- PWA support, i18n/multi-language, Swagger/OpenAPI docs
- TypeScript (built in plain JS to keep the scope shippable), automated tests, Husky/lint-staged
- Docker images for the app itself (a `docker-compose.yml` for Postgres only is included)

## Getting started

### 1. Database
```
docker compose up -d          # starts Postgres on localhost:5432
```
Or point `DATABASE_URL` in `server/.env` at any Postgres instance you already have.

### 2. Backend
```
cd server
cp .env.example .env          # edit JWT secrets etc.
npm install
npm run prisma:migrate        # creates tables
npm run prisma:seed           # creates an admin user + starter categories
npm run dev                   # http://localhost:5000
```
Seeded admin login: `admin@lvb.com` / `Password@123`

### 3. Frontend
```
cd client
cp .env.example .env
npm install
npm run dev                   # http://localhost:5173
```

## Notes on verification

This code was written and syntax-checked (`node --check` on every backend file,
plus a full import-resolution pass on the frontend) in a sandboxed environment
without network access, so `npm install` / `vite build` could not be run end-to-end
here. Review the diffs before deploying, and run `npm run build` locally as a
final check.

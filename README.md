# Thailand Book Numbers / Overseas

## Project Overview
E-Commerce platform for selling 999 Thai books (serial numbers 001-999) to international
buyers. Offer-based system (minimum $1 per book), automatic 15-day cycle, WhatsApp
integration, Stripe/PayPal payments, and multi-language support.

## Tech Stack
- Frontend: Next.js + Tailwind CSS + next-i18next
- Backend: Node.js + Express + MongoDB (Mongoose)
- Authentication: JWT + bcrypt
- Payments: Stripe + PayPal
- Hosting (suggested): Vercel (frontend), Render/AWS/DigitalOcean (backend), MongoDB Atlas (database)

## Folder Structure
```
thailand-books/
 |- frontend/     Next.js app (pages, components, styles)
 |- backend/      Express API (routes, models, middleware)
 |- README.md
```

## Setup Instructions

### 1. Install dependencies

Frontend:
```
cd frontend
npm install
```

Backend:
```
cd backend
npm install
```

### 2. Environment variables

Backend - copy `backend/.env.example` to `backend/.env` and fill in real values:
```
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_SECRET=your_paypal_secret
```

Frontend - copy `frontend/.env.local.example` to `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

### 3. Run in development

Backend (from `backend/` folder):
```
npm run start
```
The server will run even without MONGODB_URI set (it just warns and skips the DB
connection), so you can test the frontend UI immediately. Add a real MongoDB URI
later to test the database-backed routes.

Frontend (from `frontend/` folder):
```
npm run dev
```
Open http://localhost:3000 in your browser.

## Features Checklist
- 999 Books (001-999) skeleton
- Offer-based system with $1 minimum validation
- Auto 15-day cycle logic
- WhatsApp message/link generator
- Multi-language config (24 locales scaffolded)
- Stripe/PayPal payment routes
- Admin panel pages (dashboard, books, offers, payments, users)
- Responsive design (Tailwind)
- Security middleware (Helmet, rate limiting, JWT, bcrypt)
- One-click "Install App" / Add to Home Screen (PWA)
- Adsterra ad slots (Home page, Book Details page, site-wide Social Bar)

## Adding Your Adsterra Ads
1. Open `frontend/config/ads.js`.
2. Log in to your Adsterra dashboard, create an ad unit for this site, and copy
   the exact HTML/script code Adsterra gives you.
3. Paste that code as a string into `HOME_BANNER_AD`, `BOOK_DETAILS_BANNER_AD`,
   or `SOCIAL_BAR_AD` (whichever ad type it is).
4. Save, commit, and push to GitHub - your host (Render/Vercel) will redeploy
   automatically and the ad will appear. Leave a slot as `` (empty) to hide it.

## One-Click "Add to Home Screen"
The site is already set up as an installable PWA (manifest + service worker +
an "Install App" button in the header):
- On Android/Chrome: the button appears automatically and installs the site
  in one tap once the site is live on HTTPS (this only works on a real
  deployed URL, not on `localhost`).
- On iPhone/iPad (Safari): there's no one-tap install API from Apple, so the
  button shows a short instruction ("tap Share > Add to Home Screen") instead.
- Replace `frontend/public/icon-192.png` and `icon-512.png` with your own
  logo (same file names, same square dimensions) whenever you have real
  branding ready.

## Notes on Testing
- This is a skeleton/starter project. The admin panel and cart currently show sample
  data - they are not yet wired to live API calls. That wiring (fetch/axios calls from
  the frontend pages to the backend routes) is the next step once you confirm this
  skeleton runs correctly on your machine.
- If `npm install` or `npm run dev` gives an error, copy the exact error message and
  send it back so it can be fixed before creating the final ZIP.

## Support
- Email: support@thailandbooks.com
- WhatsApp: +1234567890

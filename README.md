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

## Admin Panel Access
`/admin` and all its sub-pages (Books, Offers, Payments, Users) are protected
by a password - only people who know it can log in and manage the site.
1. On Render, open the **backend** service -> Environment -> add:
   `ADMIN_PASSWORD` = a strong password only you know.
2. Visit `https://your-frontend-url.onrender.com/admin/login` and log in with
   that password. You'll stay logged in for 12 hours, then need to log in
   again.
3. This is enforced on the backend too (not just hidden on the frontend), so
   even a direct API request without the right login token is rejected.

## New Features (Number Grid, Currency, Translate, Share, News, Image Ads)

- **Number grid Home page**: browse books 000-999 via search or quick-jump
  ranges, tap a number to make an offer (min $1 USD).
- **Currency selector** (top menu): purely for display convenience - shows
  an approximate conversion next to the USD amount. Actual offers are always
  recorded and confirmed in USD. Update the static rates in
  `frontend/utils/currency.js` occasionally if they drift too far from
  reality.
- **Translate button** (top menu): a Google Translate widget - visitors can
  switch the whole page to their language with one click. No translation
  files to maintain.
- **Share button** (floating, bottom-right, blue, pulsing): uses the
  phone's native share sheet, or copies the link on desktop.
- **Install App button** (floating, bottom-right, coral): works as a real
  1-tap install on Android/Chrome; shows manual instructions on iOS/other
  browsers (Apple does not allow 1-tap install from the web - this is a
  platform restriction, not something any site can change).
- **How to Offer page** (`/how-to-offer`): step-by-step guide for customers.
- **News/Media page** (`/news`) + **Admin > Manage News**: add headline,
  image URL, and text from the admin panel - no coding needed, publishes
  immediately.
- **Image Ads** (shown on Home page) + **Admin > Image Ads**: paste an
  image URL and an optional link - it appears as a card on the Home page.
  This is separate from Adsterra; it's for your own promos/sponsors.

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

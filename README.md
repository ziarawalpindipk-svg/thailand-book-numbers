# Thailand Book Numbers - Overseas

## What This Is
An offer-based marketplace for 1000 unique Thai book numbers (000-999).
Visitors browse the number grid, pick a number, set their own offer price
in whichever currency they like, and send that offer straight to the
owner's WhatsApp for review. No lottery, no random draw, no accounts
required - it's a simple, direct offer/negotiation system between the
customer and the site owner.

## Live Deployment
- **Frontend (what customers see):** deployed on Render, root directory `frontend`
- **Backend (API + database):** deployed on Render, root directory `backend`
- **Database:** MongoDB Atlas (free M0 cluster)

If your Render service names differ from the defaults, adjust the URLs in
the environment variables below accordingly.

## Tech Stack
- **Frontend:** Next.js (Pages Router) + Tailwind CSS
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Admin auth:** a single shared password (`ADMIN_PASSWORD`) + JWT session token
- **Ads:** Adsterra (banner + social bar) wired into `frontend/config/ads.js`,
  plus a self-service "Image Ads" system managed from the admin panel
- **PWA:** installable "Add to Home Screen" support (manifest + service worker)

## Folder Structure
```
thailand-books/
 |- frontend/     Next.js app (pages, components, styles, config)
 |- backend/      Express API (routes, models, middleware)
 |- README.md
```

## Setup Instructions

### 1. Install dependencies
```
cd frontend && npm install
cd backend && npm install
```

### 2. Environment variables

**Backend** - copy `backend/.env.example` to `backend/.env`:
```
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
ADMIN_PASSWORD=choose_a_strong_admin_password
STRIPE_SECRET_KEY=your_stripe_key       (optional, not currently used in the UI)
PAYPAL_CLIENT_ID=your_paypal_client_id  (optional, not currently used in the UI)
PAYPAL_SECRET=your_paypal_secret        (optional, not currently used in the UI)
```

**Frontend** - copy `frontend/.env.local.example` to `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WHATSAPP_NUMBER=923001234567
```
`NEXT_PUBLIC_WHATSAPP_NUMBER` is the **owner's** WhatsApp number - this is
where every customer offer gets sent. Digits only, no `+` or leading `00`.

### 3. Run locally
```
cd backend && npm run start
cd frontend && npm run dev
```
The backend runs fine even without `MONGODB_URI` set (it just can't save
data yet) - handy for quickly testing the frontend UI.

## What's on Each Page

| Page | Purpose |
|---|---|
| `/` | Home - number grid (000-999), search, quick-jump ranges, offer dialog |
| `/how-to-offer` | Step-by-step guide for customers |
| `/news` | Media/News list (managed from the admin panel) |
| `/cart` | "Selected" - the customer's chosen numbers before checkout |
| `/checkout` | Customer details form + sends the offer to WhatsApp |
| `/admin/login` | Admin-only password login |
| `/admin` | Admin dashboard with quick links to every admin section |
| `/admin/books` | Add/delete book records (optional catalog data) |
| `/admin/offers` | View submitted offers, Accept/Reject |
| `/admin/payments` | Payment status overview (placeholder/manual for now) |
| `/admin/users` | Placeholder - not currently wired to real signups (there is no public login/register anymore) |
| `/admin/news` | Add/delete News items shown on `/news` |
| `/admin/image-ads` | Add/delete self-service image ad cards shown on the Home page |

There is intentionally **no public Login/Register** - customers never need
an account to send an offer.

## How Currency Works (Important)
Currency selection (top of every page) is **not** a live exchange-rate
converter. Whichever currency a customer picks, offer amounts are simply
whole numbers in that currency (1, 2, 3...). There is no math or conversion
between currencies - "5 KWD" and "5 PKR" are two completely different
things, recorded exactly as entered. Switching currency while the cart has
items will ask for confirmation and clear the selection, since amounts in
different currencies can't be combined.

## Admin Panel Password
1. Set `ADMIN_PASSWORD` in the backend's environment variables on Render.
2. Visit `/admin/login` and log in with that password.
3. The session lasts 12 hours, then you'll need to log in again.
4. This is enforced on the backend too (not just hidden on the frontend) -
   a request without a valid admin token is rejected with a 401/403, even
   if someone tries to call the API directly.

## Managing News (No Coding Needed)
Admin -> "Manage News": paste a headline, an image URL (upload your photo
to a free host like postimages.org or imgur.com first, then paste the
"direct link" it gives you), and some text. Click Add - it publishes to
`/news` immediately. Delete removes it the same way.

## Managing Image Ads (No Coding Needed)
Admin -> "Image Ads": paste an image URL (same way as News) and, optionally,
a link to open when tapped. It appears as a card on the Home page. This is
separate from Adsterra - it's for your own promos/sponsors/announcements.

## Adsterra Ads
Paste your Adsterra ad codes into `frontend/config/ads.js`:
- `HOME_BANNER_AD` - shown on the Home page, below the number grid (a
  larger banner, e.g. 300x250)
- `BOOK_DETAILS_BANNER_AD` - shown on the Home page, right near the top (a
  thinner banner, e.g. 320x50)
- `SOCIAL_BAR_AD` - loads once, site-wide (Adsterra's floating "Social Bar" format)

If an ad slot doesn't show up even though the code is correct, it's
usually an Adsterra-side issue (that specific ad zone still pending
approval, or no ads currently available for that size/region) rather than
a bug in the site - check the zone's status in the Adsterra dashboard.

## PWA / "Add to Home Screen"
A floating coral button (📲) lets visitors install the site like an app:
- **Android/Chrome:** true 1-tap install
- **iOS/Safari:** shows manual instructions (Apple does not allow 1-tap
  install from websites - this is a platform restriction, not something
  any site can change)

## Known Limitations / Things to Revisit Later
- Stripe/PayPal routes exist in the backend but aren't wired into the
  checkout flow yet - all payment arrangements currently happen manually
  over WhatsApp.
- `/admin/users` and `/admin/books` are present but not central to the
  current flow (there's no public signup, and the book catalog is optional
  since the number grid itself is what customers browse).
- The 24-locale i18n scaffolding from an earlier version was removed in
  favor of a simpler, more reliable Google-Translate-free experience;
  there is currently no in-page translation feature.

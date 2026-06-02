# RedCircle — Blood Donation Network

A full-stack blood donation web application built for Bangladesh. Connect donors with patients in need, organize campaigns, and save lives.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Phone OTP + Email)
- **Storage**: Supabase Storage (profile photos, certificates)
- **Maps**: Leaflet (OpenStreetMap)
- **PDF**: @react-pdf/renderer (donation certificates)
- **Push**: Web Push API

## Features

- 🔍 **Donor Directory** — Search verified donors by blood group, district, availability
- 🩸 **Donation Logging** — Log donations with auto cooldown, PDF certificate generation
- 📋 **Blood Request Board** — Post/respond to urgent blood requests
- 📅 **Campaigns** — Create and join blood donation drives
- 🏥 **Hospital Directory** — 25+ hospitals with map view, emergency numbers
- 📚 **Education Center** — Blood type compatibility, FAQ, myths vs facts
- 👤 **Donor Profiles** — Public profiles with QR codes
- 🔔 **Notifications** — In-app feed for cooldown, requests, badges
- 🏆 **Leaderboard** — District and national donor rankings
- 🛡️ **Admin Panel** — Verify donors, moderate content, view stats

## Setup

### Prerequisites

- Node.js 18+
- A Supabase project
- (Optional) Google Maps API key

### 1. Clone and install

```bash
cd RedCircle
npm install --legacy-peer-deps
```

### 2. Environment variables

Copy `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_maps_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key
VAPID_SUBJECT=mailto:admin@redcircle.app
```

Generate VAPID keys:
```bash
npx web-push generate-vapid-keys
```

### 3. Database setup

Run the migration in your Supabase SQL editor:

```sql
-- Copy and execute the contents of:
supabase/migrations/001_initial_schema.sql
```

Or use Supabase CLI:
```bash
supabase db push
```

### 4. Storage buckets

Create these buckets in Supabase Storage:
- `profiles` — for profile photos (public)
- `donations` — for PDF certificates (public)

### 5. Seed the database

```bash
npm run seed
```

This inserts:
- 30 donor profiles across 8 districts
- 25 Bangladesh hospitals
- 10 blood requests
- 5 upcoming campaigns
- Badges for all donors

### 6. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add all environment variables
4. Deploy

```bash
npm run build
```

## Admin Access

The admin panel is at `/admin`. Access is controlled by email — set an admin email in `app/admin/page.tsx`:

```ts
const isAdmin = profile?.email === 'your-admin-email@domain.com'
```

## Project Structure

```
/app
  /(main)         — public pages with navbar/footer
  /auth           — login, signup, callback
  /dashboard      — authenticated user dashboard
  /donors         — donor directory
  /requests       — blood request board
  /campaigns      — campaigns/blood drives
  /hospitals      — hospital directory
  /education      — blood education center
  /donor/[id]     — public donor profile
  /leaderboard    — community rankings
  /admin          — admin panel
  /api            — REST API routes

/components
  /ui             — reusable UI components
  /layout         — navbar, footer, theme provider
  /donors         — donor card, directory
  /requests       — request card, board, detail
  /campaigns      — campaign card, detail
  /hospitals      — hospital directory, map
  /profile        — donor profile, certificate
  /notifications  — notifications center
  /admin          — admin panel

/lib
  /supabase       — client, server, middleware
  /utils          — helpers (date, badge, etc.)
  /constants      — blood types, districts, etc.

/types            — TypeScript interfaces
/scripts          — seed script
/supabase
  /migrations     — SQL schema
```

## Blood Compatibility

| Blood Type | Can Donate To | Can Receive From |
|------------|--------------|------------------|
| O-         | All types    | O-               |
| O+         | O+, A+, B+, AB+ | O-, O+        |
| A-         | A-, A+, AB-, AB+ | O-, A-       |
| A+         | A+, AB+      | O-, O+, A-, A+   |
| B-         | B-, B+, AB-, AB+ | O-, B-       |
| B+         | B+, AB+      | O-, O+, B-, B+   |
| AB-        | AB-, AB+     | All - types      |
| AB+        | AB+ only     | All types        |

## License

MIT

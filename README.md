# 🗳️ CSS AGS Feedback Poll — NIT Silchar

> A production-ready, secure voting web application for the Computer Science Society, NIT Silchar.
> Built with Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Google OAuth.

---

## 📁 Folder Structure

```
css-voting-app/
├── prisma/
│   └── schema.prisma              # Database schema (Vote, User, Account, Session)
├── public/
│   └── images/
│       ├── css-logo.png           ← PUT CSS LOGO HERE (200×200px recommended)
│       ├── raunak.jpg             ← PUT RAUNAK'S PHOTO HERE (400×400px)
│       └── rishi.jpg              ← PUT RISHI'S PHOTO HERE (400×400px)
├── src/
│   ├── app/
│   │   ├── admin/dashboard/
│   │   │   └── page.tsx           # Admin dashboard (server component, guards access)
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   │   └── route.ts       # NextAuth handler
│   │   │   ├── vote/
│   │   │   │   └── route.ts       # POST vote, GET vote status
│   │   │   └── admin/
│   │   │       ├── stats/route.ts # GET stats (admin only)
│   │   │       ├── reset/route.ts # DELETE all votes (admin only)
│   │   │       └── export/route.ts# CSV export (admin only)
│   │   ├── auth/error/
│   │   │   └── page.tsx           # Auth error page (wrong domain, etc.)
│   │   ├── vote/
│   │   │   └── page.tsx           # Voting page (students)
│   │   ├── thank-you/
│   │   │   └── page.tsx           # Post-vote confirmation page
│   │   ├── globals.css            # Global styles + glassmorphism
│   │   ├── layout.tsx             # Root layout
│   │   └── page.tsx               # Landing/login page
│   ├── auth.ts                    # Auth.js v5 configuration
│   ├── components/
│   │   ├── LoginButton.tsx        # Google sign-in button (client)
│   │   ├── VotingUI.tsx           # Candidate cards + vote form (client)
│   │   └── AdminDashboardClient.tsx # Charts, table, search, reset (client)
│   ├── lib/
│   │   ├── prisma.ts              # Prisma singleton client
│   │   └── adminAuth.ts           # Admin middleware helper
│   └── types/
│       └── next-auth.d.ts         # Session type extensions
├── .env.example                   # Environment variables template
├── .gitignore
├── next.config.ts
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🖼️ Adding Photos & Logo

### CSS Society Logo
1. Get the CSS logo image (PNG with transparent background preferred)
2. Resize to **200×200px** (or keep aspect ratio, min 100px)
3. Save as: `public/images/css-logo.png`
4. The app will automatically display it. If the image fails to load, a text fallback ("CSS") is shown.

### Candidate Photos
1. Get a clear headshot/photo of each candidate
2. Resize to **400×400px** (square crop works best)
3. Save files as:
   - `public/images/raunak.jpg` → for Raunak Bhattacharjee
   - `public/images/rishi.jpg` → for Rishi Karmakar
4. If a photo file is missing, the candidate's initial letter is shown as a fallback.

> **Supported formats:** `.jpg`, `.jpeg`, `.png`, `.webp`

---

## 🛠️ Local Development Setup

### Prerequisites
- Node.js 18+ (`node -v`)
- npm or yarn
- PostgreSQL database (local or cloud like [Neon](https://neon.tech) or [Supabase](https://supabase.com))
- Google Cloud account for OAuth

---

### Step 1 — Clone & Install Dependencies

```bash
git clone https://github.com/YOUR_USERNAME/css-voting-app.git
cd css-voting-app
npm install
```

---

### Step 2 — Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# PostgreSQL connection string
DATABASE_URL="postgresql://postgres:password@localhost:5432/css_voting"

# Generate with: openssl rand -base64 32
AUTH_SECRET="your-generated-secret-here"

AUTH_URL="http://localhost:3000"
NEXTAUTH_URL="http://localhost:3000"

# From Google Cloud Console (see Step 3)
AUTH_GOOGLE_ID="your-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-client-secret"

# Admin emails (comma-separated, exact match)
ADMIN_EMAILS="soumya_ug_23@cse.nits.ac.in,jauhari_ug_23@cse.nits.ac.in"

# Allowed student email domain
ALLOWED_EMAIL_DOMAIN="cse.nits.ac.in"
```

---

### Step 3 — Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "CSS Voting App")
3. Enable **Google+ API** or **People API** (if needed)
4. Go to **Credentials → Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (local)
   - `https://your-app.vercel.app/api/auth/callback/google` (production)
7. Copy **Client ID** and **Client Secret** into `.env.local`

---

### Step 4 — Set Up Database

**Option A: Local PostgreSQL**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE css_voting;"
```

**Option B: Neon (free cloud PostgreSQL, recommended for Vercel)**
1. Go to [neon.tech](https://neon.tech) → Create account → New project
2. Copy the connection string (with `?sslmode=require`) into `DATABASE_URL`

**Then run Prisma migrations:**
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to database (dev only)
# Or for production:
npm run db:migrate     # Run with migration history
```

---

### Step 5 — Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

### Step 6 — Test Flows

#### Test Student Login
1. Open [http://localhost:3000](http://localhost:3000)
2. Click "Continue with Google"
3. Sign in with a `@cse.nits.ac.in` account
4. You should be redirected to the voting page
5. Try with a `@gmail.com` account — you should see the "Access Denied" page

#### Test Voting Flow
1. Sign in as a student
2. Select a candidate card
3. Click "Confirm Vote"
4. You should be redirected to the Thank You page
5. Try visiting `/vote` again — you should be redirected to `/thank-you`

#### Test Admin Login
1. Sign in with `soumya_ug_23@cse.nits.ac.in` or `jauhari_ug_23@cse.nits.ac.in`
2. You should be automatically redirected to `/admin/dashboard`
3. View stats, charts, vote log
4. Test CSV export
5. Test Reset Poll (will ask for confirmation)

---

## 🚀 Vercel Deployment (Step-by-Step)

### Step 1 — Create GitHub Repository
```bash
cd css-voting-app
git init
git add .
git commit -m "Initial commit: CSS AGS Voting App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/css-voting-app.git
git push -u origin main
```

### Step 2 — Set Up Production Database (Neon recommended)
1. Go to [neon.tech](https://neon.tech) → Create project → Copy connection string
2. Save the string — you'll need it for Vercel

### Step 3 — Import Project into Vercel
1. Go to [vercel.com](https://vercel.com) → Log in with GitHub
2. Click **"Add New Project"**
3. Import your `css-voting-app` repository
4. Framework: **Next.js** (auto-detected)

### Step 4 — Configure Environment Variables in Vercel
In the Vercel dashboard → Project Settings → Environment Variables, add:

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Your Neon/Supabase PostgreSQL URL |
| `AUTH_SECRET` | Random 32-byte secret (`openssl rand -base64 32`) |
| `AUTH_URL` | `https://your-app.vercel.app` |
| `NEXTAUTH_URL` | `https://your-app.vercel.app` |
| `AUTH_GOOGLE_ID` | Google OAuth Client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth Client Secret |
| `ADMIN_EMAILS` | `soumya_ug_23@cse.nits.ac.in,jauhari_ug_23@cse.nits.ac.in` |
| `ALLOWED_EMAIL_DOMAIN` | `cse.nits.ac.in` |

### Step 5 — Update Google OAuth Redirect URI
1. Go back to [Google Cloud Console → Credentials](https://console.cloud.google.com/apis/credentials)
2. Edit your OAuth 2.0 Client
3. Add to Authorized redirect URIs:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

### Step 6 — Deploy
1. Click **"Deploy"** in Vercel
2. Wait for build to complete (~2-3 min)
3. Run database migrations on production:
   ```bash
   # From your local machine with production DATABASE_URL:
   DATABASE_URL="your-neon-url" npx prisma db push
   ```
   Or use Vercel's CLI: `vercel env pull && npx prisma db push`

### Step 7 — Verify Deployment
1. Visit `https://your-app.vercel.app`
2. Test student sign-in (with `@cse.nits.ac.in` email)
3. Test admin sign-in
4. Cast a test vote
5. View admin dashboard

---

## 👨‍💼 Admin Usage Guide

### Accessing the Dashboard
- Only `soumya_ug_23@cse.nits.ac.in` and `jauhari_ug_23@cse.nits.ac.in` can access `/admin/dashboard`
- All other users are blocked (redirected to `/vote`)
- The check is enforced **server-side** — cannot be bypassed

### Viewing Vote Results
1. Sign in with an admin Google account
2. You are automatically redirected to `/admin/dashboard`
3. Dashboard shows:
   - Total votes cast
   - Per-candidate vote counts and percentages
   - Interactive bar chart
   - Interactive pie chart
   - Distribution percentage bars

### Searching Votes
- Use the search box in the Vote Log table
- Search by voter **email** or **candidate name**
- Results filter in real time

### Exporting to CSV
1. Click **"Export CSV"** button in the Vote Log section
2. A `.csv` file downloads with columns: ID, Email, Candidate, Timestamp
3. Open in Excel, Google Sheets, or any spreadsheet app

### Resetting the Poll
> ⚠️ **This permanently deletes all votes. Export CSV first!**

1. Click **"🗑 Reset Poll"** (bottom of dashboard)
2. Read the confirmation modal carefully
3. Click **"Yes, Reset All Votes"**
4. All votes are cleared; the poll is ready for a fresh session
5. Students can vote again after a reset

### Starting a Fresh Election
1. Export the current results as CSV (for your records)
2. Click "Reset Poll" and confirm
3. Share the voting URL with students again: `https://your-app.vercel.app`

### Changing Admin Emails
1. Go to Vercel → Project Settings → Environment Variables
2. Edit `ADMIN_EMAILS`
3. Comma-separate multiple emails: `admin1@cse.nits.ac.in,admin2@cse.nits.ac.in`
4. Redeploy (Vercel auto-redeploys on env var changes)
5. For local dev, update `.env.local` and restart the server

---

## 🔒 Security Features

| Feature | Implementation |
|---------|---------------|
| Domain restriction | `signIn` callback rejects non-`@cse.nits.ac.in` emails |
| Duplicate vote prevention | `UNIQUE` constraint on `email` in `votes` table |
| Admin protection | `requireAdmin()` middleware on all `/api/admin/*` routes |
| Server-side validation | Candidate names validated server-side in `/api/vote` |
| Session security | Database sessions via `@auth/prisma-adapter` |
| No client-side secrets | All env vars with `AUTH_*` are server-only |

---

## 🔧 Useful Commands

```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run start         # Start production server
npm run db:studio     # Open Prisma Studio (visual DB browser)
npm run db:push       # Sync schema to database (no migration history)
npm run db:migrate    # Create a new migration
npm run db:reset      # Reset database (dev only!)
npm run lint          # Run ESLint
```

---

## ❓ Troubleshooting

**"Access Denied" for @cse.nits.ac.in emails**
- Verify `ALLOWED_EMAIL_DOMAIN=cse.nits.ac.in` in `.env.local`
- Check that the Google account's email actually ends with `@cse.nits.ac.in`

**Database connection errors**
- Check `DATABASE_URL` is correct
- For Neon/Supabase, ensure `?sslmode=require` is appended
- Run `npx prisma db push` after schema changes

**Google OAuth errors**
- Verify the redirect URI in Google Console matches exactly
- Check `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` are correct

**Admin dashboard not loading**
- Confirm `ADMIN_EMAILS` exactly matches the Google account email
- There must be no spaces in the comma-separated list

---

## 📞 Support

For technical issues, contact the CSS Web Team or file an issue on the GitHub repository.

---

*Built with ❤️ for Computer Science Society, NIT Silchar*

# Vercel Full-Stack Deployment Guide

## Overview
This project is set up for full-stack deployment on Vercel with:
- **Frontend**: React + Vite (deployed to Vercel Edge)
- **Backend**: Express.js (deployed as Vercel Serverless Functions)

## Deployment Steps

### Step 1: Go to Vercel Dashboard
1. Visit [vercel.com](https://vercel.com)
2. Click **New Project**
3. Import your GitHub repo: `Krishnabhujade/Wedding_planner`

### Step 2: Configure Project Settings
1. **Framework Preset**: Other
2. **Build Command**: `npm run build` (auto-detected)
3. **Output Directory**: Leave empty (Vercel auto-detects)
4. **Install Command**: `npm install` (auto-detected)

### Step 3: Add Environment Variables
Vercel will prompt for environment variables. Add:

- **DATABASE_URL**: Your Neon PostgreSQL connection string
  ```
  postgresql://neondb_owner:...@ep-red-snow-...pooler.c-4.us-east-1.aws.neon.tech/neondb
  ```

- **NODE_ENV**: `production`

### Step 4: Deploy
Click **Deploy** and Vercel will:
1. Build the frontend (Vite) → `dist/public/*`
2. Build the backend (esbuild) → `dist/index.cjs`
3. Deploy frontend to Edge Network
4. Deploy backend as Serverless Functions

## Architecture on Vercel

```
vercel.com/your-app/
├── Frontend (React SPA)
│   ├── /             → index.html (Invitation page)
│   ├── /events       → Events page
│   ├── /gallery      → Gallery page
│   ├── /rsvp         → RSVP page
│   └── /admin        → Admin dashboard
│
└── Backend API (Express)
    ├── GET  /api/wedding      → Wedding details
    ├── GET  /api/events       → All events
    ├── POST /api/guests       → Add guest
    ├── GET  /api/guests       → Get all guests
    ├── PATCH /api/guests/:id  → Update guest
    ├── DELETE /api/guests/:id → Delete guest
    └── [other API routes]
```

## How It Works

1. **SPA Routing**: `vercel.json` in client folder rewrites all routes to `index.html`
2. **API Proxy**: Frontend automatically calls `/api/*` endpoints
3. **Serverless Backend**: Express runs in Vercel Serverless Functions
4. **Database**: Connected to Neon PostgreSQL

## After Deployment

Your app will be available at:
```
https://your-project-name.vercel.app/
```

All API calls from the frontend will automatically work because:
- Frontend and backend are on the same domain
- Client routes handled by React Router
- API routes handled by Express backend

## Troubleshooting

### API calls returning 404
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Check backend is building: `npm run build` locally should create `dist/index.cjs`

### Frontend showing blank page
- Verify `client/vercel.json` has rewrites configured
- Check browser console for build errors

### Database connection errors
- Verify `DATABASE_URL` is correct in Vercel dashboard
- Run `npm run db:push` locally to ensure schema exists

## Redeploying

Push updates to GitHub and Vercel auto-redeploys:
```bash
git push origin main
```

Or manually redeploy in Vercel dashboard → **Redeploy**.

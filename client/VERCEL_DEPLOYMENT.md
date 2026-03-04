# Vercel Frontend Deployment Guide

## Overview
The `client` folder is now a fully independent Vite + React application that can be deployed on Vercel without the Express backend.

## Project Structure
```
client/
├── src/                    # React source code
├── public/                 # Static assets
├── index.html             # HTML entry point
├── vite.config.ts         # Vite configuration (React plugin)
├── package.json           # Frontend dependencies only
├── .env.example           # Environment variables template
├── .vercelignore          # Files ignored during Vercel deployment
└── vercel.json            # Vercel deployment configuration
```

## Deployment to Vercel

### Step 1: Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `Krishnabhujade/Wedding_planner`

### Step 2: Configure Deployment Settings
When Vercel prompts for project settings, configure as follows:

- **Framework Preset**: Vite
- **Project Name**: shaadi-planner-client (or your preferred name)
- **Root Directory**: `./client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

Alternatively, if Vercel doesn't auto-detect, manually set these in project settings.

### Step 3: Environment Variables (Optional)
If your frontend needs to call a backend API:

1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-api.com` (e.g., Railway, Render URL)
3. Redeploy for changes to take effect

### Step 4: Verify SPA Routing
The `vercel.json` file is already configured with rewrites to handle React Router:
- All routes redirect to `/index.html`
- React React Router handles client-side routing
- No backend routing needed for frontend pages

## Building Locally

```bash
cd client

# Install dependencies
npm install

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Development Server

```bash
cd client

# Start Vite dev server with hot reload
npm run dev
```

Server runs at `http://localhost:5173`

## API Integration

The frontend is configured to make API calls to the backend:

- **Development**: Proxies to `http://localhost:5000` (see `vite.config.ts`)
- **Production**: Uses `VITE_API_URL` environment variable

### Using API in Components

```typescript
const response = await fetch(`${import.meta.env.VITE_API_URL}/api/wedding`);
```

Or configure React Query to use the API URL:

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey: [url] }) => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}${url}`
        );
        if (!response.ok) throw new Error("Request failed");
        return response.json();
      },
    },
  },
});
```

## Backend Deployment

The backend (Express server) can be deployed separately on:
- **Railway** (recommended)
- **Render**
- **Heroku**
- **DigitalOcean**

See `../README.md` for backend deployment instructions.

## Files Ignored During Vercel Deployment

The `.vercelignore` file ensures these are not uploaded:
- `server/` - Express backend
- `shared/` - Shared TypeScript types
- `script/` - Build scripts
- `node_modules` - Dependencies (Vercel installs fresh)

## Troubleshooting

### Routes return 404
- Verify `vercel.json` rewrites are configured
- Check that React Router is properly initialized in `App.tsx`

### API calls fail
- Ensure `VITE_API_URL` is set in Vercel environment variables
- Check CORS settings on backend
- Verify backend is deployed and running

### Build fails
- Run `npm install` locally to ensure dependencies are correct
- Check `client/package.json` has all required packages
- Verify `vite.config.ts` syntax is correct

## Support

For issues with:
- **Vercel deployment**: [Vercel Docs](https://vercel.com/docs)
- **Vite**: [Vite Docs](https://vitejs.dev)
- **React**: [React Docs](https://react.dev)

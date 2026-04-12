# Deployment

Rarebox is deployed on **Vercel** with automatic deployments from the `main` branch. This page documents how the deployment works and how to self-host.

## Production Deployment (Vercel)

### How It Works

1. Push to `main` on GitHub
2. Vercel detects the push and starts a build
3. `npm run build` runs Vite, outputting static files to `dist/`
4. Python serverless functions in `api/` are bundled with `@vercel/python@4.5.0`
5. Static files are deployed to Vercel's CDN
6. Serverless functions are deployed as edge functions
7. Live at [rarebox.io](https://rarebox.io) within ~60 seconds

### `vercel.json` Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/health", "destination": "/api/health" },
    { "source": "/api/search", "destination": "/api/search" },
    { "source": "/api/price", "destination": "/api/price" },
    { "source": "/api/sealed", "destination": "/api/sealed" },
    { "source": "/((?!api/).*)", "destination": "/index.html" }
  ],
  "functions": {
    "api/**/*.py": {
      "runtime": "@vercel/python@4.5.0",
      "maxDuration": 30
    }
  }
}
```

**Rewrites explained:**
- API routes (`/api/*`) pass through to serverless functions
- Everything else falls through to `/index.html` — this is what makes Vue Router's HTML5 history mode work (clean URLs without hash fragments)

### DNS

- `rarebox.io` points to Vercel
- `docs.rarebox.io` points to the docs site (separate Vercel project)

## Self-Hosting

Want to run your own instance? Here's what you need.

### Option 1: Vercel (Recommended)

1. Fork `novaoc/rarebox` on GitHub
2. Create a new project on [vercel.com](https://vercel.com)
3. Import your fork
4. Vercel auto-detects the Vite framework and Python functions
5. Deploy — no configuration needed

### Option 2: Static Hosting + Separate API

The frontend is a standard Vite SPA — it can be hosted anywhere that serves static files:

```bash
npm run build
# Upload contents of dist/ to any static host
```

**But:** You'll need to handle the serverless functions separately. Options:
- Run them as a standalone Python server (see `price-server/` directory)
- Port them to your preferred serverless platform (AWS Lambda, Cloudflare Workers, etc.)
- Skip them entirely — the app works without them, you just lose meta deck data and some price proxying

### Option 3: Docker

<!-- TODO: create a Dockerfile if there's demand -->

No official Docker image yet. The app is simple enough that a Dockerfile would be straightforward:

```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

This only serves the frontend. You'd need a separate container or service for the Python API functions.

## Analytics

Rarebox uses two Vercel services for anonymized metrics:

- **Vercel Analytics** — page views, no cookies, no PII
- **Vercel Speed Insights** — Core Web Vitals (LCP, FID, CLS)

Both are opt-in at the Vercel project level. Self-hosted instances won't have analytics unless you configure your own.

## Domain Setup

If you're deploying your own instance with a custom domain:

1. Add the domain in Vercel project settings
2. Update DNS records (Vercel provides the values)
3. Vercel handles SSL automatically
4. Update the `sitemap.xml` and OG tags in `public/` to reflect your domain

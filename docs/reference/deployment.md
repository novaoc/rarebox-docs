# Deployment

Rarebox is deployed on **Vercel** with automatic deployments from the `main` branch. This page documents how the deployment works and how to self-host.

## Production Deployment (Vercel)

### How It Works

1. Push to `main` on GitHub — by you, or by the daily
   [data-refresh workflow](/architecture/serverless) committing fresh price
   and meta-deck JSON into `public/`
2. Vercel detects the push and starts a build
3. `npm run build` runs Vite, outputting static files to `dist/`
4. Static files are deployed to Vercel's CDN
5. The one remaining Python function, `api/og.py` (social-embed images for
   crawlers — the app never calls it), is bundled with `@vercel/python@4.5.0`
6. Live at [rarebox.io](https://rarebox.io) within ~60 seconds

The app itself is **local-only**: Vercel hands the device code and static
assets, and the device makes every data call itself. There are no serverless
data endpoints.

### `vercel.json` Configuration

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
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
- Everything except `/api/og` falls through to `/index.html` — this is what makes Vue Router's HTML5 history mode work (clean URLs without hash fragments). Static files in `public/` (including the pre-built price/meta-deck JSON) are served before rewrites apply.

### DNS

- `rarebox.io` points to Vercel
- `docs.rarebox.io` points to the docs site (separate Vercel project)

## Self-Hosting

Want to run your own instance? Here's what you need.

### Option 1: Vercel (Recommended)

1. Fork `novaoc/rarebox` on GitHub
2. Create a new project on [vercel.com](https://vercel.com)
3. Import your fork
4. Vercel auto-detects the Vite framework (and the one `api/og.py` function)
5. Deploy — no configuration needed

Your fork ships with working price and meta-deck data: the JSON assets in
`public/` are committed to the repo, just frozen at fork time. To keep them
refreshing daily, configure the data-refresh workflow — edit its
`if: github.repository == ...` guard to your fork, set your own `User-Agent`
in `scripts/build_*_prices.py` (tcgcsv requires an identifying UA), and
enable the workflow in your fork's Actions tab. Full steps in
[Static Data Pipeline → Running a Fork Correctly](/architecture/serverless#running-a-fork-correctly).

### Option 2: Static Hosting + Separate API

The frontend is a standard Vite SPA — it can be hosted anywhere that serves static files:

```bash
npm run build
# Upload contents of dist/ to any static host
```

Since the app is local-only, static hosting is all it needs — there are no
serverless data endpoints to port. Two things to know:

- The price/meta-deck JSON in `public/` deploys as plain files; run the
  `scripts/build_*.py` scripts (cron, CI, or by hand) and redeploy to keep
  them fresh — see [Static Data Pipeline](/architecture/serverless)
- The only thing you lose without Vercel is `/api/og` social-embed images;
  link previews fall back to the static OG tags

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

This serves the full app — the data assets are part of the build output. Only `/api/og` social embeds would be missing (see Option 2).

## Analytics

There are none — removed in v1.4.2 as a deliberate privacy decision. Rarebox ships no analytics scripts, counts no page views, and sets no cookies. If you self-host a fork, please keep it that way (see the contributing guidelines).

## Domain Setup

If you're deploying your own instance with a custom domain:

1. Add the domain in Vercel project settings
2. Update DNS records (Vercel provides the values)
3. Vercel handles SSL automatically
4. Update the `sitemap.xml` and OG tags in `public/` to reflect your domain

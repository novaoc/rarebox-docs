# Development Setup

Get Rarebox running locally for development.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**

## Clone & Install

```bash
git clone https://github.com/novaoc/rarebox.git
cd rarebox
npm install
```

## Start Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173`. Vite provides instant HMR — changes to Vue components, CSS, and JS reflect immediately.

## Test Serverless Functions Locally

The Python serverless functions in `api/` can be tested with the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

This starts a combined dev server: Vite handles the frontend, Vercel CLI emulates the serverless function runtime. API endpoints are available at `/api/*`.

### Python Dependencies

The serverless functions require Python 3.9+ with:

```bash
pip install httpx beautifulsoup4
```

These are specified in `requirements.txt` and installed automatically by Vercel during deployment.

## Environment Variables

Create a `.env` file in the project root if needed:

```bash
# Optional: pokemontcg.io API key for higher rate limits (20k/day without, more with)
# VITE_POKEMONTCG_API_KEY=your-key-here
```

::: tip
You don't need an API key to develop locally. The default rate limit (20,000 requests/day) is more than enough for development.
:::

## Build for Production

```bash
npm run build
```

Outputs to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Project Structure

See [Project Structure](/architecture/project-structure) for a full walkthrough of the codebase.

## Key Patterns

### Adding a New TCG

1. Create a fetcher in `src/services/tcg/cardPreloader.js`
2. Add a provider entry in `src/services/tcg/providers.js`
3. Add search handler in `src/services/tcg/multiSearch.js`
4. Add game constant in `src/components/CardLoadIndicator.vue`
5. Update price refresh routing in `src/stores/portfolio.js`
6. Update data schema docs

### Adding a New API Integration

1. Create a service in `src/services/` following existing patterns
2. Add caching (in-memory with TTL, 404 caching, request timeouts)
3. Add retry with backoff (2 retries, 1s/2s delays)
4. Set a 15-second timeout on all fetches
5. If server-side is needed (CORS, scraping), add a Python function in `api/`
6. Document the integration in `docs/architecture/api-integrations.md`

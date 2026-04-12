# Environment Variables

Rarebox is designed to work without any configuration. There are no required environment variables.

## Frontend (Vite)

No `VITE_` environment variables are currently used. The app makes unauthenticated requests to all external APIs:
- pokemontcg.io — free tier, 20,000 requests/day without a key
- tcgdex — public API, no key required
- PriceCharting — public JSON API with CORS, no key required

If pokemontcg.io rate limits become an issue, a `VITE_POKEMONTCG_API_KEY` variable could be added for higher limits. This would be configured in the Vercel project settings.

## Serverless Functions (Python)

The Python functions in `api/` don't require any environment variables. They make unauthenticated requests to public APIs (Limitless TCG, PriceCharting).

## Vercel

These are configured in the Vercel project settings, not in code:

| Variable | Purpose |
|----------|---------|
| `VERCEL_ANALYTICS_ID` | Auto-configured by Vercel when analytics is enabled |
| `VERCEL_TOKEN` | Used for CLI deploys: `vercel --token $VERCEL_TOKEN --yes --prod` |

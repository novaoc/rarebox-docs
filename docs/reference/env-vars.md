# Environment Variables

Rarebox is designed to work without any configuration. There are no required environment variables.

## Frontend (Vite)

No `VITE_` environment variables are currently required. The app makes unauthenticated requests to most external APIs:

| API | Auth Required | Notes |
|-----|--------------|-------|
| pokemontcg.io | No (free tier, 20k/day) | Optional API key for higher limits |
| tcgdex | No | Public API |
| Scryfall | No | CORS `*`, no key needed |
| YGOPRODeck | No | Public API |
| Lorcast | No | CORS `*`, no key needed |
| optcgapi | No | Public API |
| riftcodex | No | Open REST API |
| PriceCharting (free) | No | CORS-open JSON API |
| PriceCharting (paid) | Yes (user-provided) | Optional, stored in localStorage |

### Optional API Keys

**pokemontcg.io:** A `VITE_POKEMONTCG_API_KEY` variable can be added for higher rate limits. This would be configured in the Vercel project settings.

**PriceCharting (paid tier):** Users can optionally provide a PriceCharting API key in Settings → API Key. This enables the paid tier for sealed product search and detailed product lookups. The key is stored in localStorage (`pricecharting_api_key`), not in environment variables.

## Serverless Functions (Python)

The Python functions in `api/` don't require any environment variables. They make unauthenticated requests to public APIs (Limitless TCG, PriceCharting).

## Vercel

These are configured in the Vercel project settings, not in code:

| Variable | Purpose |
|----------|---------|

| `VERCEL_TOKEN` | Used for CLI deploys: `vercel --token $VERCEL_TOKEN --yes --prod` |

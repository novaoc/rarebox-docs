# API Rate Limits

When developing Rarebox locally, you're hitting the same public APIs that production uses. Be aware of rate limits to avoid getting blocked.

## pokemontcg.io

| | Without API Key | With API Key |
|---|---|---|
| Daily limit | 20,000 requests | Higher (varies by key type) |
| Rate | ~1000/min | Higher |

**In practice:** The 20k daily limit is more than enough for development. You'd have to be deliberately hammering the API to hit it. If you're doing bulk testing or data migration work, consider getting a free API key from [pokemontcg.io](https://pokemontcg.io).

## PriceCharting

PriceCharting doesn't publish official rate limits for their JSON API, but aggressive scraping will get your IP blocked. Rarebox limits concurrent requests to 3-5 and adds delays between batches.

**During development:** Don't write loops that hit PriceCharting hundreds of times. Use the existing caching layer — if you've fetched a price once, it's cached for the session.

## Scryfall

No published rate limit, but be respectful. Rarebox caches results for 1 hour and uses the bulk data endpoint for preloading (2 requests for all MTG cards).

## YGOPRODeck

No published rate limit. Results cached in memory for 1 hour. The API supports batch queries which Rarebox uses for efficient card loading.

## Lorcast

No published rate limit. Results cached in memory for 1 hour.

## optcgapi

No published rate limit. All ~3300 cards fetched in one call, searched client-side. Results cached in memory for 1 hour.

## riftcodex

No published rate limit. Open REST API. Results cached in memory for 1 hour.

## tcgdex

tcgdex is a community API with generous limits. No known issues during normal development.

## Limitless TCG

Not an API — we scrape their HTML. Be respectful:

- Don't scrape in tight loops
- Cache results aggressively (24h in production)
- During development, test against cached/mocked responses when possible rather than hitting the live site repeatedly

## How Rarebox Handles Rate Limits

The existing fetch infrastructure handles rate limiting automatically:

```
Request
  → Check in-memory cache (1h TTL)
    → Hit: return cached, no API call
    → Miss: make request
      → 429 (rate limited): retry after 1s delay
      → 5xx (server error): retry after 1s, then 2s
      → Success: cache response
      → 404: cache as miss (never retry)
      → Timeout (15s): retry with backoff
      → All retries exhausted: surface error
```

**Max retries:** 2 (with 1s and 2s delays)
**Max concurrent requests:** 3-5
**Request timeout:** 15 seconds

## Card Preloading

The card preload system makes many API requests on first visit to build the local card database. This is expected and happens in the background. Once preloaded, search and browse use the local cache — no API calls.

**During development:** You can skip preloading by clearing localStorage and not selecting any TCGs on first visit. Or let it run once and benefit from the cached data.

## Tips for Development

1. **Use the app normally first** — let the caching layer warm up before you start digging into code
2. **Don't clear caches unnecessarily** — if you're testing UI changes, you don't need fresh API data every time
3. **Mock data for unit tests** — when writing tests, don't hit real APIs. Use mock data fixtures
4. **Check DevTools Network tab** — watch for unexpected API call patterns (duplicate calls, missing cache hits, tight loops)

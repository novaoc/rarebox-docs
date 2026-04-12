# API Integrations

Rarebox pulls data from several external APIs. Each has different characteristics, rate limits, and caching strategies. This page documents what data comes from where and how to work with each API during development.

## pokemontcg.io

**Purpose:** Card data (names, images, sets, types) and live TCGPlayer market prices.

**Called from:** Browser (client-side)

**Endpoint:** `https://api.pokemontcg.io/v2/cards`

**Key details:**
- Responses are trimmed using the `select=` query parameter to reduce payload size by 50-60%
- Rate limit: 20,000 requests/day without an API key, higher with a key
- Optional API key can be passed via `X-Api-Key` header for higher rate limits
- Results are cached in-memory for 1 hour
- 404s are cached as misses to avoid repeated lookups for non-existent cards
- All requests have a 15-second timeout

**Price fields used:**
- `tcgplayer.prices.holofoil.market` (or equivalent for the card's variant)
- Falls through variant types: holofoil → reverseHolofoil → normal → 1stEditionHolofoil

## tcgdex

**Purpose:** Japanese sets and cards, English name mapping, card images, and price history (November 2022 onwards).

**Called from:** Browser (client-side)

**Endpoints:**
- Sets: `https://api.tcgdex.net/v2/en/sets`
- Cards: `https://api.tcgdex.net/v2/ja/sets/{setId}`
- Price history: `https://api.tcgdex.net/v2/en/cards/{cardId}/price-history`
- Card images: CDN at `https://assets.tcgdex.net/`

**Key details:**
- Japanese card prices come from CardMarket in EUR — Rarebox converts to USD client-side
- Set logos for Japanese sets come from Pokellector CDN, not tcgdex
- Price history data availability starts November 2022
- Set data is cached in localStorage for 24 hours

## PriceCharting

**Purpose:** Sealed product prices (booster boxes, ETBs, tins) and graded slab prices (grade-specific).

**Called from:** Browser (client-side, direct JSON API calls)

**Key details:**
- No API key required — uses their public JSON API
- Prices reflect recent sales data aggregated across multiple marketplaces
- Fetched directly from the browser with no backend proxy
- Graded prices are grade-specific (e.g., PSA 10 vs PSA 9 for the same card)
- Staleness threshold: 12 hours (shorter than cards due to higher price volatility)

## Limitless TCG

**Purpose:** Current tournament meta deck data — top decks, meta share percentages, championship points.

**Called from:** Vercel serverless function (`/api/search`)

**Key details:**
- Data is **scraped** from Limitless TCG's website using httpx + BeautifulSoup (no official API)
- Core cards are resolved server-side with exact card match (set code + number)
- Server-side caching recommended — results don't change more than once per day
- If Limitless changes their HTML structure, the scraper will break and need updating

::: warning Scraping Dependency
The Limitless TCG integration is the most fragile part of the system. It relies on HTML structure that can change without notice. If meta decks stop loading, the scraper likely needs updating. Check `/api/search.py` first.
:::

## Pokellector

**Purpose:** Set logo images for Japanese TCG sets.

**Called from:** Browser (image CDN)

**Key details:**
- Used only for Japanese set logos — English sets use pokemontcg.io images
- CDN URLs are constructed from set identifiers
- No API calls — just image URLs

## Adding a New API Integration

If you're adding a new data source:

1. Follow the existing caching pattern — in-memory cache with TTL, 404 caching, request timeouts
2. Batch concurrent requests (max 3-5 in flight)
3. Add retry with backoff (2 retries, 1s/2s delays)
4. Set a 15-second timeout on all fetches
5. If the API requires server-side calls (CORS, scraping), add a new Python function in `api/`
6. Document the staleness threshold for the new data type

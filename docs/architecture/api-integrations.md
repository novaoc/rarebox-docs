# API Integrations

Rarebox pulls data from several external APIs. Each has different characteristics, rate limits, and caching strategies. This page documents what data comes from where and how to work with each API during development.

## pokemontcg.io

**Purpose:** Card data (names, images, sets, types) and live TCGPlayer market prices for Pokémon.

**Called from:** Browser (client-side)

**Endpoint:** `https://api.pokemontcg.io/v2/cards`

**Key details:**
- **Bulk card data comes from the official `PokemonTCG/pokemon-tcg-data` GitHub dataset via the jsDelivr CDN** — 173 per-set JSON files fetched 12-wide load all 20,000+ cards in ~10 seconds (the paginated API averages 7–30s *per page*). The API is then used only for a background price pass (`select=id,tcgplayer`, 6 pages in parallel, incremental saves every ~15 pages, automatic resume if interrupted)
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

## Scryfall

**Purpose:** Magic: The Gathering card data, USD prices, and set symbol icons.

**Called from:** Browser (client-side)

**Endpoint:** `https://api.scryfall.com`

**Key details:**
- CORS `*` — no proxy needed
- Sets filtered to paper, non-digital, physical set types
- Bulk data endpoint (`/bulk-data`) used for full card database preload (~545k cards in 2 requests)
- Card images from Scryfall CDN
- Prices from `prices.usd` or `prices.usd_foil`
- Results cached in memory for 1 hour

## YGOPRODeck

**Purpose:** Yu-Gi-Oh! card data, images, and prices.

**Called from:** Browser (client-side)

**Endpoint:** `https://db.ygoprodeck.com/api/v7/cardinfo.php`

**Key details:**
- CORS `*` — no proxy needed
- Search by card name (`fname` parameter)
- Card images from YGOPRODeck CDN
- Prices: each printing uses its **own `card_sets[].set_price`** (the card-level `tcgplayer_price` reflects the cheapest reprint and is only a fallback) — a $1.85 Metal Raiders common was showing $0.20 before this distinction
- Set information from `card_sets[0]`
- Results cached in memory for 1 hour

## Lorcast

**Purpose:** Disney Lorcana card data and USD prices.

**Called from:** Browser (client-side)

**Endpoint:** `https://api.lorcast.com/v0`

**Key details:**
- CORS `*` — no proxy needed
- Set and card data with images and USD prices
- Prices available at `c.prices?.usd` (Lorcast API format)
- Results cached in memory for 1 hour

## optcgapi

**Purpose:** One Piece Card Game sets, cards, and USD market prices.

**Called from:** Browser (client-side)

**Endpoint:** `https://optcgapi.com/api`

**Key details:**
- All ~3300 cards fetched in one call, searched client-side
- Set ordering hardcoded to match release order
- API response can return `{ data: [...] }` or bare array — handler checks both
- Results cached in memory for 1 hour

## riftcodex.com

**Purpose:** Riftbound (League of Legends TCG) sets, cards, and card images.

**Called from:** Browser (client-side)

**Endpoint:** `https://api.riftcodex.com`

**Key details:**
- CORS `*` — no proxy needed
- Open REST API, no API key required
- 7 sets (Origins, Spiritforged, Unleashed, promo sets), 1000+ cards
- Card images from Riot Games CDN (`cmsassets.rgpub.io`)
- Pagination: 100 cards per page
- **No prices** — card data only. Each card carries a `tcgplayer_id`, which is
  what makes exact price joins possible (see note below)
- Results cached in memory for 1 hour

::: note Price Source — exact join, variant-aware
riftcodex provides card metadata and images; prices are TCGplayer market
prices from the pre-built `/riftbound-prices.json` static asset (see
[Static Data Pipeline](/architecture/serverless)), joined on each card's
`tcgplayer_id`. Every printing is its own TCGplayer product, so matches are
exact — **a variant (`(Signature)`, `(Alternate Art)`) never falls back to
the plain card's price** (no price beats a wrong one), and promo sets
(PR/OPP/JDG) are fully covered. `(Overnumbered)` is the plain printing of an
over-set-size champion. If the asset yields no prices for a set (e.g. newer
than the last daily refresh), the provider falls back to the old
PriceCharting search (three queries per set around its 100-result cap,
filtered by console name, variant-aware). Search, trade analyzer, portfolio
refresh, and the offline cache all hydrate from this same per-set price map.
:::

## tcgcsv.com

**Purpose:** Daily TCGplayer price dumps — Riftbound singles (category 89) and Japanese Pokémon cards (category 85 "Pokemon Japan").

**Called from:** CI only (`scripts/build_riftbound_prices.py`, `scripts/build_jp_prices.py` via the daily `refresh-data.yml` workflow) — **never the browser**. tcgcsv has no CORS and its terms allow backend scripts only. The app consumes the results as static assets (`/riftbound-prices.json`, `/jp-prices.json`).

**Key details:**
- Requires an identifying `User-Agent` (`Rarebox/1.4 (+https://rarebox.io)`) — generic browser UAs get a 401. Forks must use their own (see [Static Data Pipeline](/architecture/serverless))
- Updates once daily around 20:00 UTC; `last-updated.txt` is the change stamp, and the scripts re-sync only when it moves
- Japanese Pokémon join: tcgcsv group abbreviations match tcgdex set ids, product `Number` ("205/187") matches tcgdex `localId`
- ≤10k requests/day allowed; a full sync of both categories uses a few hundred

## PriceCharting

**Purpose:** Sealed product prices (booster boxes, ETBs, tins), graded slab prices (grade-specific), and market prices for non-Pokémon TCG cards (Magic, Yu-Gi-Oh!, Lorcana, One Piece; for Riftbound singles it's now only the fallback when the static price asset has nothing).

**Called from:** Browser (client-side, direct JSON API calls)

**Two integration modes:**

### Free Tier (priceFeedService)
- No API key required
- Endpoint: `https://www.pricecharting.com/games/{game}.json`
- Used for card price lookup in portfolios and trade analyzer
- 6-hour IDB cache via `prices_cache` table
- CORS-open — no backend proxy needed

### Paid Tier (priceCharting.js)
- Requires user-provided API key (stored in localStorage)
- Used for sealed product search and detailed product lookup
- 4-hour localStorage cache, max 500 entries
- Falls back gracefully if no key is provided

**Key details:**
- Prices reflect recent sales data aggregated across multiple marketplaces
- Graded prices are grade-specific (e.g., PSA 10 vs PSA 9 for the same card)
- Staleness threshold: 12 hours (shorter than cards due to higher price volatility)

## Limitless TCG

**Purpose:** Current tournament meta deck data — top decks, meta share percentages, championship points.

**Called from:** CI only (`scripts/build_meta_decks.py` via the daily `refresh-data.yml` workflow); the client (`metaDecksApi.js`) reads the result from the `/meta-decks/{game}.json` static asset

**Key details:**
- Data is **scraped** from Limitless TCG's website using httpx + BeautifulSoup (no official API)
- Core cards are resolved in the build script with exact card match (set code + number)
- Client-side service fetches the static asset with localStorage fallback (24h cache)
- Static fallback decks available when the asset is missing or empty for a game
- If Limitless changes their HTML structure, the scraper will break and need updating

::: warning Scraping Dependency
The meta-deck scrapers are the most fragile part of the system — they rely on
HTML structure that can change without notice. If meta decks stop loading,
check `scripts/build_meta_decks.py` first. As of mid-2026 only the Pokémon
(Limitless) scraper yields decks: the MTG/One Piece/Yu-Gi-Oh selectors are
stale and the Lorcana/Riftbound sources 403; those games run on the client's
fallback decks. The daily workflow keeps the previous day's file whenever a
scraper fails, so a broken scraper degrades to stale decks, never none.
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
7. Add a provider entry in `src/services/tcg/providers.js` for browse/search integration

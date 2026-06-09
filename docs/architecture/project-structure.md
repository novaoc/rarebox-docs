# Project Structure

This page walks through the Rarebox codebase so you know where everything lives and why.

## Top-Level Layout

```
rarebox/
├── api/                    # Vercel serverless functions (Python)
│   ├── health.py           # Health check endpoint
│   ├── search.py           # Meta deck scraping from Limitless TCG
│   ├── price.py            # Price proxy/lookup
│   └── sealed.py           # Sealed product price fetching
├── price-server/           # Standalone price server (development/testing)
├── public/                 # Static assets (favicon, manifest, robots.txt, sitemap)
├── src/
│   ├── assets/             # CSS, images, static resources
│   ├── components/         # Vue components
│   │   └── scanner/        # Camera scanner components
│   ├── data/               # Static data files
│   ├── router/             # Vue Router configuration
│   ├── services/           # API integration modules
│   │   └── tcg/            # Multi-TCG card cache, preload, search, providers
│   ├── stores/             # Pinia stores (state management)
│   ├── utils/              # Utility functions
│   ├── views/              # Page-level Vue components (routed)
│   ├── App.vue             # Root component
│   ├── db.js               # Dexie.js persistence layer
│   └── main.js             # App entry point
├── index.html              # SPA entry HTML
├── package.json
├── vercel.json             # Vercel deployment config
├── vite.config.js          # Vite build config
└── requirements.txt        # Python dependencies for serverless functions
```

## Key Directories

### `src/stores/`

The heart of the application. Pinia stores manage all state:

- **`portfolio.js`** — The main store. Manages portfolios, items, snapshots, price alerts, settings. Handles persistence to IndexedDB via `db.js`. Contains the async `init()` method that hydrates state on load and the debounced `persist()` / immediate `persistNow()` methods for writing back. Supports all 6 TCGs with game-specific price refresh routing.
- **`trade.js`** — Trade analyzer state. Side A vs Side B with item lists, fairness calculation. Stored in separate IDB key (`trade_state`) to prevent race conditions with portfolio persistence.
- **`decks.js`** — Deck CRUD, card operations (`addCardToDeck`, `updateCardQuantity`, `removeCardFromDeck`), stats computation (`getDeckStats` cross-references against portfolio store), and meta deck import (`importMetaDeck`). Stored in localStorage (`rarebox_decks`), not IDB.
- **`scanner.js`** — Camera scanner UI state. Minimal state holder for scanner open/close, current session, and process status.

### `src/db.js`

The persistence layer. Wraps Dexie.js with these exports:

- **`loadState()`** — reads the entire app state from IndexedDB
- **`saveState(value)`** — writes the entire state blob to IndexedDB
- **`loadTradeState()`** — reads trade state from separate IDB key
- **`saveTradeState(value)`** — writes trade state to separate IDB key
- **`isStale(item)`** — checks if an item's price is past its staleness threshold (24h for cards, 12h for sealed/graded)
- **`hasNeverPriced(item)`** — returns true if an item has never had a successful price fetch
- **`queryCache(table, key)`** — reads from a key-value cache table
- **`updateCache(table, key, value, ttl)`** — writes to a cache table with TTL

Three IDB tables:
- `state` — app state (`app_state`) and trade state (`trade_state`)
- `prices_cache` — PriceCharting price cache with TTL
- `cards` — preloaded card database indexed by `[game+set+id]`

### `src/services/`

API integration modules. Each service encapsulates one external API:

- **`pokemonApi.js`** — pokemontcg.io wrapper. `searchCards()`, `getCard()`, `getSets()`, `getSetCards()`, `getMarketPrice()`. Uses `select=` parameter to trim payloads. In-memory cache with 1h TTL.
- **`priceCharting.js`** — PriceCharting paid API. Browser-direct fetch with CORS. `searchPC()` for sealed/graded product search. 1h TTL cache, max 200 entries. Requires API key.
- **`priceFeedService.js`** — PriceCharting free tier. `fetchGamePriceFeed(game)` for bulk game pricing. `resolvePrice(game, cardName)` for individual card lookups. 6h IDB cache via `prices_cache` table. No API key required.
- **`priceHistory.js`** — tcgdex price-history GitHub repo. Fetches historical TCGPlayer data (Nov 2022+). 404s cached as misses.
- **`metaDecksApi.js`** — Serverless endpoint (`/api/search`) wrapper. Fetches live meta decks from Limitless TCG. 24h localStorage cache with fallback.
- **`priceServer.js`** — Legacy price server client. Browser-direct PriceCharting JSON search. Used by scanPipeline and trade analyzer.

### `src/services/tcg/`

Multi-TCG card system:

- **`cardCache.js`** — Dexie IDB card cache. `saveCardsToCache()`, `getCardsFromCache()`, `searchCacheIndex()`. In-memory Map index for O(1) lookup. Used by cardPreloader and multiSearch.
- **`cardPreloader.js`** — Two-phase background preload. Phase 1: fast set list fetch. Phase 2: full card data fetch. Per-TCG fetchers for all 6 games. Progress tracking for UI updates.
- **`multiSearch.js`** — Fan-out search across all 6 TCG providers. Parallel queries, merge + deduplicate. Abort/timeout support (20s). Fast providers mode for scanner.
- **`providers.js`** — Provider registry for browse. `searchSets(game)`, `searchCards(game, query)`, `getCardDetail(game, id)`. Normalized Set/Card shapes across all games. Used by TcgSetsView and BrowseView.

### `src/utils/`

- **`alerts.js`** — Price alert CRUD, browser notification integration, `checkAlerts()` against a price map. localStorage persistence (`rarebox_alerts`).
- **`backup.js`** — JSON export/import of all Rarebox data. `exportBackup()` dumps portfolios, settings, snapshots, and price caches. `importBackup()` atomically replaces all data and reloads. Uses pako for gzip compression.
- **`collectrImport.js`** — Collectr CSV/XLSX import. Parses card names, sets, quantities, conditions, grading info. Auto-detects game type. Japanese card detection. Variance normalization.
- **`excel.js`** — XLSX export of portfolio data (summary + items sheets). Uses SheetJS.
- **`ocrService.ts`** — Tesseract.js OCR worker. Lazy-loaded singleton. Card name extraction from OCR text. Card number extraction via regex patterns.
- **`scanPipeline.ts`** — OCR → multiSearch pipeline. Candidate scoring (name similarity + price availability). Fast providers only for speed. 25s total timeout.

### `src/data/`

- **`metaDecks.js`** — Static meta deck data with hardcoded card IDs and images for instant resolution. Fallback when live API is unavailable.

### `src/components/`

Vue single-file components:

- **`AddItemModal.vue`** — Add cards, sealed products, or graded slabs. Three-step flow: type → search → configure.
- **`BulkImportModal.vue`** — Paste PTCGL/PTCGO deck lists for bulk card import.
- **`CardDatabaseLoader.vue`** — First-run TCG selection modal. Shows card counts per game, triggers background preload.
- **`CardLoadIndicator.vue`** — Floating pill showing preload progress. Expandable per-game status, speed/ETA.
- **`InstallPrompt.vue`** — PWA install prompt with platform detection.
- **`LocalSyncModal.vue`** — Device-to-device sync via QR code or clipboard. Gzip-compressed base64 transfer.
- **`PortfolioChart.vue`** — Portfolio value-over-time chart (ApexCharts). LOCF algorithm.
- **`PriceChart.vue`** — Individual card price history chart (ApexCharts). Variant selector.
- **`PullToRefresh.vue`** — Touch pull-to-refresh with directional lock.
- **`TourModal.vue`** — Feature tour video modal.
- **`scanner/CameraViewfinder.vue`** — Camera capture via getUserMedia. Rear camera preferred. File upload fallback.

### `src/views/`

Page-level components mapped to routes:

| View | Route | Description |
|------|-------|-------------|
| `DashboardView.vue` | `/` | Combined portfolio overview, total value, gain/loss, new user landing |
| `SearchView.vue` | `/search` | Multi-TCG card search across all 6 games |
| `SetsView.vue` | `/sets` | Browse Pokémon sets (EN/JP), click to browse cards |
| `TcgSetsView.vue` | `/tcg-sets` | Generic TCG sets browse for MTG/Yu-Gi-Oh!/Lorcana/One Piece/Riftbound |
| `BrowseView.vue` | `/browse` | TCG selector landing page — tiles linking to sets views |
| `PortfolioView.vue` | `/portfolio/:id` | Single portfolio detail with chart, item table, group-by/sort |
| `DeckListView.vue` | `/decks` | Grid of all decks with stats, game filter |
| `MetaDecksView.vue` | `/decks/meta` | Live meta decks from Limitless TCG, multi-game |
| `DeckBuilderView.vue` | `/decks/:id` | Deck editor with card search and ownership tracking |
| `TradeLanding.vue` | `/trade` | Trade analyzer intro/landing page |
| `TradeAnalyzerView.vue` | `/trade/analyzer` | Side A vs Side B comparison with grading and fairness |
| `SettingsView.vue` | `/settings` | Export, backup, alerts, reset, Collectr import, API key |
| `TermsView.vue` | `/terms` | Terms & Conditions + Privacy Policy |

### `api/`

Python serverless functions deployed as Vercel Functions:

| File | Endpoint | Purpose |
|------|----------|---------|
| `health.py` | `/api/health` | Health check |
| `search.py` | `/api/search` | Meta deck scraping from Limitless TCG |
| `price.py` | `/api/price` | Price proxy/lookup |
| `sealed.py` | `/api/sealed` | Sealed product price fetching from PriceCharting |

All use `httpx` for async HTTP requests and `beautifulsoup4` for HTML parsing. Max duration is 30 seconds (configured in `vercel.json`).

## Configuration Files

### `vercel.json`

Defines the deployment:
- Build command: `npm run build`
- Output: `dist/`
- Rewrites: API routes pass through to serverless functions; everything else falls through to `index.html` (SPA routing)
- Python runtime: `@vercel/python@4.5.0`

### `vite.config.js`

Standard Vite config with the Vue plugin. Nothing unusual.

### `requirements.txt`

Python dependencies for the serverless functions:
- `httpx>=0.27.0` — async HTTP client
- `beautifulsoup4>=4.12.0` — HTML parser

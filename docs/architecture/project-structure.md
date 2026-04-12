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
│   ├── data/               # Static data files
│   ├── router/             # Vue Router configuration
│   ├── services/           # API integration modules
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

- **`portfolio.js`** — The main store. Manages portfolios, items, snapshots, price alerts, settings. Handles persistence to IndexedDB via `db.js`. Contains the async `init()` method that hydrates state on load and the debounced `persist()` / immediate `persistNow()` methods for writing back.
- **`decks.js`** — Deck CRUD, card operations (`addCardToDeck`, `updateCardQuantity`, `removeCardFromDeck`), stats computation (`getDeckStats` cross-references against portfolio store), and meta deck import (`importMetaDeck`). Stored in localStorage (`rarebox_decks`), not IDB.

### `src/db.js`

The persistence layer. Wraps Dexie.js with these exports:

- **`loadState()`** — reads the entire app state from IndexedDB
- **`saveState(value)`** — writes the entire state blob to IndexedDB
- **`isStale(item)`** — checks if an item's price is past its staleness threshold (24h for cards, 12h for sealed/graded)
- **`hasNeverPriced(item)`** — returns true if an item has never had a successful price fetch

Uses a single-table, single-row design — one key (`app_state`) stores the entire JSON state. This is intentionally simple; the state blob is small enough that full serialization on every write is negligible.

### `src/services/`

API integration modules. Each service encapsulates one external API:

- **`pokemonApi.js`** — pokemontcg.io wrapper. `searchCards()`, `getCard()`, `getSets()`, `getSetCards()`, `getMarketPrice()`. Uses `select=` parameter to trim payloads. In-memory cache with 1h TTL.
- **`priceCharting.js`** — PriceCharting JSON API. Browser-direct fetch with CORS. `searchPC()` for sealed/graded product search. 1h TTL cache, max 200 entries.
- **`priceHistory.js`** — tcgdex price-history GitHub repo. Fetches historical TCGPlayer data (Nov 2022+). 404s cached as misses.
- **`metaDecksApi.js`** — Serverless endpoint (`/api/search`) wrapper. Fetches live meta decks from Limitless TCG.
- **`priceServer.js`** — Legacy price server client (deprecated, kept for local dev).

### `src/utils/`

- **`alerts.js`** — Price alert CRUD, browser notification integration, `checkAlerts()` against a price map.
- **`backup.js`** — JSON export/import of all Rarebox data. `exportBackup()` dumps portfolios, settings, snapshots, and price caches. `importBackup()` atomically replaces all data and reloads.
- **`excel.js`** — XLSX export of portfolio data (summary + items sheets).

### `src/data/`

- **`metaDecks.js`** — Static meta deck data with hardcoded card IDs and images for instant resolution.

### `src/components/`

Vue single-file components:

- **`AddItemModal.vue`** — Add cards, sealed products, or graded slabs. Three-step flow: type → search → configure.
- **`BulkImportModal.vue`** — Paste PTCGL/PTCGO deck lists for bulk card import.
- **`InstallPrompt.vue`** — PWA install prompt with platform detection.
- **`LocalSyncModal.vue`** — Optional cross-device sync via jsonbin.io.
- **`PortfolioChart.vue`** — Portfolio value-over-time chart (ApexCharts). LOCF algorithm.
- **`PriceChart.vue`** — Individual card price history chart (ApexCharts).
- **`TourModal.vue`** — Feature tour video modal.

### `src/views/`

Page-level components mapped to routes:

| View | Route | Description |
|------|-------|-------------|
| `DashboardView.vue` | `/` | Combined portfolio overview, total value, gain/loss |
| `SearchView.vue` | `/search` | Card search across all sets |
| `SetsView.vue` | `/sets` | Browse TCG sets (EN/JP), click to browse cards |
| `PortfolioView.vue` | `/portfolio/:id` | Single portfolio detail with chart and item table |
| `DeckListView.vue` | `/decks` | Grid of all decks with stats |
| `MetaDecksView.vue` | `/decks/meta` | Live meta decks from Limitless TCG |
| `DeckBuilderView.vue` | `/decks/:id` | Deck editor with card search and ownership tracking |
| `SettingsView.vue` | `/settings` | Export, backup, alerts, reset |
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

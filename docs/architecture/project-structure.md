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
│   ├── composables/        # Vue composables (shared reactive logic)
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia stores (state management)
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

- **`portfolio.js`** — The main store. Manages portfolios, items, snapshots, price alerts, settings. Handles persistence to IndexedDB via `db.js`. Contains the async `init()` method that hydrates state on app load and the debounced `persist()` / immediate `persistNow()` methods for writing back.

<!-- TODO: Nova — list other stores here (deck store, etc.) with one-line descriptions -->

### `src/db.js`

The persistence layer. Wraps Dexie.js with three exports:

- **`loadState()`** — reads the entire app state from IndexedDB
- **`saveState(value)`** — writes the entire state blob to IndexedDB
- **`isStale(item)`** — checks if an item's price is past its staleness threshold (24h for cards, 12h for sealed/graded)
- **`hasNeverPriced(item)`** — returns true if an item has never had a successful price fetch

Uses a single-table, single-row design — one key (`portfolio_state`) stores the entire JSON state. This is intentionally simple; the state blob is small enough that full serialization on every write is negligible.

### `src/components/`

Vue single-file components. Key patterns:

- **Bottom sheet pattern** — on mobile, detail panels and modals slide up from the bottom with drag handles and rounded corners. Triggered by `@media (hover: none)`.
- **Card grid** — responsive grid with overlay buttons (Add/Details) always visible on touch devices.

<!-- TODO: Nova — list the major components here with descriptions -->

### `src/views/`

Page-level components mapped to routes:

<!-- TODO: Nova — list views with their route paths -->

### `api/`

Python serverless functions deployed as Vercel Functions. Each file is an independent endpoint:

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

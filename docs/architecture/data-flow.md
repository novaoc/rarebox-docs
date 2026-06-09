# Data Flow & Persistence

This page explains how data moves through Rarebox — from API responses to the screen, and from user actions to durable storage.

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  Vue        │────▶│  Pinia       │────▶│  Dexie.js     │
│  Components │◀────│  Store       │◀────│  (IndexedDB)  │
└─────────────┘     └──────┬───────┘     └───────────────┘
                           │
                    ┌──────▼───────┐     ┌───────────────┐
                    │  External    │────▶│  Card Cache   │
                    │  APIs        │     │  (IDB + Mem)  │
                    └──────────────┘     └───────────────┘
```

**Pinia is the single source of truth.** Components read from the store and dispatch actions to it. The store fetches data from external APIs and writes back to IndexedDB for durability. Components never touch IndexedDB directly.

## App Startup

When the app loads, `App.vue` calls `await store.init()`. The init sequence:

1. **Try IndexedDB** — call `loadState()` from `db.js`. If data exists, hydrate the Pinia store with it.
2. **Fall back to localStorage** — if IndexedDB is empty, check for legacy `rarebox_*` localStorage keys. If found, migrate the data to IndexedDB and clear localStorage (one-time upgrade path).
3. **Fresh start** — if both are empty, initialize with default state (one empty portfolio).
4. **Load trade state** — separate IDB key (`trade_state`) loaded independently to prevent race conditions with portfolio persistence.
5. **Build search index** — if card database is ready, build in-memory search index from cached IDB data.
6. **Background preload** — if card database isn't fully loaded, start background preload for selected TCGs.

This means existing users who had data in localStorage before the IndexedDB migration see zero disruption — their data is silently migrated on first load.

## Card Database Preloading

On first visit, users select which TCGs they collect. Rarebox then preloads card data in two phases:

1. **Phase 1 (Fast):** Fetch set lists from each TCG API (~2-5 seconds)
2. `CardLoadIndicator` shows progress as a floating pill in the bottom-right corner
3. **Phase 2 (Background):** Fetch all card data for selected TCGs (~1-5 minutes depending on TCGs)
4. `CardLoadIndicator` expands to show per-game progress, speed, and ETA

Once preloaded, card data is stored in the `cards` table of Dexie (indexed by `[game+set+id]`) with an in-memory Map for O(1) lookup. Search and browse use this local cache instead of hitting APIs.

## Multi-TCG Search

The `multiSearch` service fans out to all 6 TCG providers in parallel:

```
Query → multiSearch()
  ├─ pokemonApi (pokemontcg.io)
  ├─ Scryfall (MTG)
  ├─ YGOPRODeck (Yu-Gi-Oh!)
  ├─ Lorcast (Lorcana)
  ├─ optcgapi (One Piece)
  └─ riftcodex (Riftbound)
    → Merge + deduplicate results
    → Return normalized card objects
```

Results are normalized to a common shape: `{ id, name, number, set, image, price, rarity, game }`.

## Persistence

### Debounced Writes

Every store mutation that changes persistent state (adding items, editing portfolios, updating prices, recording snapshots) calls `persist()` at the end. This is **debounced by 500ms** — rapid changes don't thrash IndexedDB.

```
User adds 5 cards quickly (within 500ms)
  → 5 calls to persist()
  → debounce collapses them into 1 IDB write
  → saveState() writes the full state blob once
```

### Immediate Flush

Some operations bypass the debounce and call `persistNow()` for an immediate write:

- **`beforeunload`** — when the user closes the tab, flush immediately so the last few seconds of changes aren't lost (registered only once via flag to prevent multiplication)
- **`resetAll()`** — when the user resets their data, clear both IDB and localStorage immediately
- **Critical mutations** — any operation where data loss would be especially bad

### What Gets Persisted

The entire store state is serialized as JSON and stored as a single IndexedDB row:

```js
{
  portfolios: [...],   // all portfolios with their items
  settings: {...},     // app settings, preferences
  snapshots: {...},    // daily price snapshot history
  // ... other store state
}
```

Trade state is stored separately under a different IDB key (`trade_state`) to prevent race conditions with portfolio persistence.

### Card Cache

Card data is stored in a separate Dexie table (`cards`) with compound index `[game+set+id]`:

```js
{
  game: "pokemon",        // TCG identifier
  set: "sv3",             // Set code
  id: "sv3-125",          // Unique card ID
  name: "Charizard ex",   // Card name
  number: "125",          // Card number
  image: "https://...",   // Card image URL
  price: 45.99,           // Current market price
  rarity: "rare",         // Card rarity
  // ... other card fields
}
```

An in-memory Map is built from IDB on startup for fast lookup. The cache is refreshed when the card preload runs.

## Private Browsing Fallback

Some browsers block IndexedDB in private/incognito mode. When this happens, Dexie throws on database open. The store catches this and continues operating in memory-only mode — the app works normally for the session but data won't persist after the tab closes.

## External API Data Flow

External API responses flow through a caching pipeline:

```
API Request
  → In-memory cache check (1h TTL)
    → Hit: return cached response
    → Miss: fetch from API
      → Success: cache response, update store, trigger persist()
      → 404: cache as miss (don't re-fetch)
      → Error: retry with backoff (2 retries, 1s/2s delays)
        → All retries failed: surface error, keep stale cached data
```

### Caching Layers

| Layer | TTL | Purpose |
|-------|-----|---------|
| In-memory (JS object) | 1 hour | Avoid repeated API calls within a session |
| localStorage (set data) | 24 hours | TCG set lists don't change frequently |
| IDB `cards` table | Permanent | Preloaded card database for offline search |
| IDB `prices_cache` table | 6 hours | PriceCharting price cache |
| IDB `state` table | Permanent | Durable persistence of portfolios and snapshots |

## Data Deletion

When a user deletes an item or portfolio:

1. Remove from Pinia store
2. Clean up associated snapshot entries (prevents orphaned data)
3. Trigger `persist()` to write the updated state to IDB

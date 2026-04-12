# Data Flow & Persistence

This page explains how data moves through Rarebox — from API responses to the screen, and from user actions to durable storage.

## Architecture Overview

```
┌─────────────┐     ┌──────────────┐     ┌───────────────┐
│  Vue        │────▶│  Pinia       │────▶│  Dexie.js     │
│  Components │◀────│  Store       │◀────│  (IndexedDB)  │
└─────────────┘     └──────┬───────┘     └───────────────┘
                           │
                    ┌──────▼───────┐
                    │  External    │
                    │  APIs        │
                    └──────────────┘
```

**Pinia is the single source of truth.** Components read from the store and dispatch actions to it. The store fetches data from external APIs and writes back to IndexedDB for durability. Components never touch IndexedDB directly.

## App Startup

When the app loads, `App.vue` calls `await store.init()`. The init sequence:

1. **Try IndexedDB** — call `loadState()` from `db.js`. If data exists, hydrate the Pinia store with it.
2. **Fall back to localStorage** — if IndexedDB is empty, check for legacy `rarebox_*` localStorage keys. If found, migrate the data to IndexedDB and clear localStorage (one-time upgrade path).
3. **Fresh start** — if both are empty, initialize with default state (one empty portfolio).

This means existing users who had data in localStorage before the IndexedDB migration see zero disruption — their data is silently migrated on first load.

## Persistence

### Debounced Writes

Every store mutation that changes persistent state (adding items, editing portfolios, updating prices, recording snapshots) calls `persist()` at the end. This is **debounced by 3 seconds** — rapid changes don't thrash IndexedDB.

```
User adds 5 cards quickly (within 3 seconds)
  → 5 calls to persist()
  → debounce collapses them into 1 IDB write
  → saveState() writes the full state blob once
```

### Immediate Flush

Some operations bypass the debounce and call `persistNow()` for an immediate write:

- **`beforeunload`** — when the user closes the tab, flush immediately so the last few seconds of changes aren't lost
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

This single-blob approach is intentionally simple. The total state size for even a large collection is well under 1MB — full serialization per write is negligible.

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
| IndexedDB (full state) | Permanent | Durable persistence of portfolios and snapshots |

## Data Deletion

When a user deletes an item or portfolio:

1. Remove from Pinia store
2. Clean up associated snapshot entries (prevents orphaned data)
3. Trigger `persist()` to write the updated state to IDB

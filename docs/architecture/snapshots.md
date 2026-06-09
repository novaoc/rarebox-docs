# Price Snapshot System

The snapshot system records daily price data for portfolio items, enabling the portfolio value-over-time chart. This page explains the internals.

## How It Works

```
App loads
  → store.init() hydrates from IndexedDB
  → for each sealed/graded item in all portfolios:
      → is there a snapshot for today's date?
        → No: record snapshot using the item's cached current price
        → Yes: skip (already recorded today)
  → persist()
```

Key constraint: **snapshots use cached prices only.** The snapshot recording step never triggers new API calls. If an item's price hasn't been fetched yet today, the snapshot uses whatever price is currently in the store (which might be yesterday's cached value — that's fine, LOCF handles it).

## Data Structure

Snapshots are stored as part of the main state blob in IndexedDB:

```js
// Conceptual structure
snapshots: {
  "item-uuid-1": {
    "2025-06-01": { price: 45.99 },
    "2025-06-02": { price: 46.50 },
    "2025-06-03": { price: 44.00 },
    // ... up to 1095 entries (3 years)
  },
  "item-uuid-2": {
    // ...
  }
}
```

Snapshots are keyed by **date string** (`YYYY-MM-DD`), not timestamp. This prevents multiple snapshots per day and makes lookup/deduplication trivial.

## LOCF (Last Observation Carried Forward)

When building the portfolio value chart, not every item has a price for every day. LOCF fills the gaps:

```
Day 1: price = $50    → chart shows $50
Day 2: no price       → chart shows $50 (carried forward)
Day 3: no price       → chart shows $50 (carried forward)
Day 4: price = $55    → chart shows $55
Day 5: no price       → chart shows $55 (carried forward)
```

This prevents artificial dips when an API was unavailable. The portfolio value stays flat rather than dropping to zero.

## Retention

Snapshots older than **3 years** (1095 days) are automatically pruned. This keeps the state blob manageable while providing meaningful historical data.

## Cleanup on Deletion

When an item is removed from a portfolio:

1. The item is deleted from the portfolio's item list
2. The item's entire snapshot history is deleted
3. The store persists the updated state

This prevents orphaned snapshot entries from accumulating over time and inflating the state blob.

## Chart Rebuild

When the portfolio value chart needs to re-render (e.g., after a price update or item addition), the rebuild is **debounced by 300ms**. This prevents rapid re-renders when multiple prices update in quick succession.

## Edge Cases

### Item added today, no price yet
The item has no `lastRefreshed` timestamp and no snapshot. The chart excludes it until the first successful price fetch.

### API down for multiple days
LOCF carries the last known price forward. The chart doesn't drop — it flatlines at the last known value. When the API recovers, normal snapshots resume.

### Clock skew
Snapshots use the browser's local date. If a user's clock is wrong, snapshots might record under the wrong date. This is a known limitation — not worth solving for the client-side-only architecture.

### Multi-TCG price refresh
Different TCGs have different price sources. The portfolio store fans out price refresh to the appropriate API based on each item's `game` field. Pokémon items use pokemontcg.io; all other TCGs use PriceCharting via `priceFeedService`.

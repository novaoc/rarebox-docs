# Data Schema

This page documents the shape of data structures stored in Rarebox's IndexedDB state. Use this as a reference when working with the Pinia store or writing import/export logic.

## Portfolio

```js
{
  id: "uuid-string",              // crypto.randomUUID()
  name: "My Collection",         // User-defined name
  color: "#f5a623",              // Hex color for sidebar dot and charts
  createdAt: "2026-04-08T...",   // ISO string
  items: [PortfolioItem]         // Array of items in this portfolio
}
```

## Portfolio Item

```js
{
  id: "uuid-string",              // crypto.randomUUID()
  type: "card",                   // "card" | "sealed" | "graded"
  name: "Charizard ex",          // Display name
  setName: "Obsidian Flames",    // Set name (human readable)
  setCode: "sv3",                // pokemontcg.io set ID
  cardId: "sv3-125",             // pokemontcg.io card ID (cards only)
  number: "125",                 // Card number within set
  imageUrl: "https://...",       // Card/product image URL
  quantity: 1,                   // How many owned
  purchasePrice: 25.00,          // What the user paid per unit
  purchaseDate: "2026-01-15",    // ISO date string (optional)
  currentMarketPrice: 45.99,     // Latest fetched market price (cards)
  currentValue: 45.99,           // Latest value (sealed/graded)
  lastPriceUpdate: "2026-04-08T...", // ISO string of last successful price fetch
  addedAt: "2026-04-08T...",     // ISO string when added to portfolio

  // Card-specific fields:
  cardData: { /* full pokemontcg.io card object */ },
  _lang: "en",                   // "en" | "ja" — used to detect JP cards for tcgdex routing

  // Graded items only:
  gradingCompany: "PSA",         // "PSA" | "BGS" | "CGC" | "ACE"
  grade: 10,                     // Numeric grade (e.g., 10, 9.5, 8)

  // Sealed items only:
  // (no special fields beyond type === "sealed")
}
```

## Snapshot

Snapshots are keyed by portfolio ID. Each portfolio has an array of daily snapshots:

```js
{
  [portfolioId]: [
    {
      date: "2026-04-08",       // YYYY-MM-DD string
      ts: 1744080000000,         // Timestamp (ms)
      values: {
        [itemId]: 45.99,         // Price at snapshot time
        [itemId]: 12.50,
        // ...
      }
    },
    // ... up to 1095 entries (3 years max)
  ]
}
```

Snapshots are trimmed to `MAX_SNAPSHOTS = 1095` per portfolio. Oldest entries are dropped first.

The `recordSnapshot(portfolioId)` function records today's prices for all items. `autoSnapshot()` checks each portfolio and records if today hasn't been captured yet.

## Deck

Decks are stored separately from portfolios in localStorage (`rarebox_decks`), not in the IDB state blob:

```js
{
  id: "uuid-string",              // crypto.randomUUID()
  name: "Charizard ex Deck",     // User-defined name
  cards: [DeckCard],             // Array of cards in the deck
  createdAt: "2026-04-08T..."    // ISO string
}
```

## Deck Card

```js
{
  cardId: "sv3-125",             // pokemontcg.io card ID
  name: "Charizard ex",          // Card name
  setName: "Obsidian Flames",    // Set name
  setCode: "sv3",                // Set ID
  number: "125",                 // Card number
  quantity: 2,                   // How many in the deck
  price: 45.99,                  // Market price (null if unresolved)
  image: "https://..."           // Card image URL (small)
}
```

Deck stats are computed on the fly by `getDeckStats(deckId)`, which cross-references against the portfolio store to build an `ownedMap` of `cardId → totalQty`.

## Price Alert

Price alerts are stored in localStorage (`rarebox_alerts`), not in the IDB state blob:

```js
{
  id: "uuid-string",             // crypto.randomUUID()
  cardId: "sv3-125",             // pokemontcg.io card ID
  cardName: "Charizard ex",      // Display name
  condition: "above",            // "above" | "below"
  threshold: 50.00,              // Price threshold in USD
  currentPrice: 45.99,           // Price at time of alert creation
  triggered: false,              // Whether alert has fired
  triggeredAt: null,             // ISO string when triggered (null until fired)
  triggeredPrice: null,          // Price when triggered (set on trigger)
  createdAt: "2026-04-08T..."    // ISO string
}
```

## Full State Blob

The entire app state persisted to IndexedDB as a single JSON row:

```js
{
  portfolios: [Portfolio],
  activePortfolioId: "uuid-string",
  settings: {
    currency: "USD",
    defaultPortfolioId: null
  },
  snapshots: {
    [portfolioId]: [Snapshot]
  }
}
```

This is stored in IndexedDB under the key `app_state` in the `state` table of the `Rarebox` Dexie database. The Pinia store is the source of truth; IDB is the persistence layer.

**Not in the state blob** (stored separately in localStorage):
- `rarebox_decks` — deck store (uses localStorage, not IDB)
- `rarebox_alerts` — price alerts (uses localStorage, not IDB)
- `ph_cache_*` — PriceCharting response cache (1h TTL)
- `rarebox_meta_decks_cache` — Limitless meta deck data (24h TTL)
- `rarebox_sets_*` — EN/JP set listings (24h TTL)

## Staleness Thresholds

Used by `isStale(item)` in `src/db.js`:

| Item Type | Threshold (ms) | Human Readable |
|-----------|---------------|----------------|
| `card` | 86,400,000 | 24 hours |
| `sealed` | 43,200,000 | 12 hours |
| `graded` | 43,200,000 | 12 hours |

Items with no `lastPriceUpdate` timestamp and no `currentMarketPrice` / `currentValue` are classified as "never priced" (`hasNeverPriced()`), which is a distinct state from "stale."

## Persistence Details

- **Debounce:** 3 seconds between mutation and IDB write
- **Beforeunload flush:** Immediate `saveState()` on tab close
- **Deep clone:** State is `JSON.parse(JSON.stringify(...))`'d before IDB write to strip Vue reactive proxies
- **Migration:** On first load after upgrade, localStorage data is read and written to IDB, then legacy keys are cleared

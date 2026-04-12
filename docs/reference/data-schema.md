# Data Schema

This page documents the shape of data structures stored in Rarebox's IndexedDB state. Use this as a reference when working with the Pinia store or writing import/export logic.

::: info
The schemas below are documented from the README and architecture discussions. Nova should verify these match the actual implementation and fill in any missing fields.
:::

## Portfolio

```js
{
  id: "uuid-string",           // Unique identifier
  name: "My Collection",       // User-defined name
  color: "#4f46e5",           // Hex color for charts
  items: [PortfolioItem],     // Array of items in this portfolio
  createdAt: 1719849600000    // Timestamp
}
```

## Portfolio Item

```js
{
  id: "uuid-string",           // Unique identifier
  type: "card",                // "card" | "sealed" | "graded"
  name: "Charizard ex",       // Display name
  set: "Obsidian Flames",     // Set name
  setCode: "sv3",             // Set code identifier
  cardNumber: "125",          // Card number within set
  imageUrl: "https://...",     // Card/product image URL
  quantity: 1,                // How many owned
  costBasis: 25.00,           // What the user paid (per unit)
  currentMarketPrice: 45.99,  // Latest fetched market price
  lastRefreshed: 1719849600000, // Timestamp of last successful price fetch

  // Graded items only:
  gradingCompany: "PSA",      // "PSA" | "BGS" | "CGC" | "ACE"
  grade: 10,                  // Numeric grade

  // Sealed items only:
  productType: "booster-box", // Product category identifier
}
```

## Snapshot Entry

```js
// Keyed by item ID, then by date string
{
  "item-uuid": {
    "2025-06-01": { price: 45.99 },
    "2025-06-02": { price: 46.50 },
    // ... up to 1095 entries (3 years)
  }
}
```

<!-- TODO: Nova — confirm the exact snapshot entry shape -->

## Deck

```js
{
  id: "uuid-string",
  name: "Charizard ex Deck",
  cards: [DeckCard],
  createdAt: 1719849600000
}
```

## Deck Card

```js
{
  id: "card-id",               // pokemontcg.io card ID
  name: "Charizard ex",
  set: "Obsidian Flames",
  imageUrl: "https://...",
  quantity: 2,                 // How many needed in the deck
  marketPrice: 45.99,          // Current market price
  owned: false,                // Whether the user owns this card (cross-ref'd against portfolios)
}
```

## Price Alert

```js
{
  itemId: "uuid-string",       // References a portfolio item
  threshold: 50.00,            // Price threshold
  direction: "above",          // "above" | "below"
  triggered: false,            // Whether the alert has fired
  createdAt: 1719849600000
}
```

<!-- TODO: Nova — confirm price alert schema and add any missing fields -->

## Full State Blob

The entire state persisted to IndexedDB as a single JSON object:

```js
{
  portfolios: [Portfolio],
  snapshots: { [itemId]: { [dateString]: SnapshotEntry } },
  settings: {
    // App-level settings
    // TODO: Nova — document settings fields
  },
  decks: [Deck],
  priceAlerts: [PriceAlert],
  // ... any other persisted state
}
```

This is stored in IndexedDB under the key `portfolio_state` in the `state` table of the `Rarebox` Dexie database.

## Staleness Thresholds

Used by `isStale(item)` in `db.js`:

| Item Type | Threshold (ms) | Human Readable |
|-----------|---------------|----------------|
| `card` | 86,400,000 | 24 hours |
| `sealed` | 43,200,000 | 12 hours |
| `graded` | 43,200,000 | 12 hours |

Items with no `lastRefreshed` timestamp and no `currentMarketPrice` are classified as "never priced" (`hasNeverPriced()`), which is a distinct state from "stale."

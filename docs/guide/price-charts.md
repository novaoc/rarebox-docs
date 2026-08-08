# Price Charts & Snapshots

Rarebox provides two types of price visualization: individual card price history and portfolio value over time.

## Card Price History

When you view a card's detail panel, you can see its price history chart. Since v1.5, history for **every game** is backed by [rarebox-price-history](https://github.com/novaoc/rarebox-price-history) — daily TCGplayer market data going back to **February 2024** across Pokémon (EN + JP), Magic, Yu-Gi-Oh!, Lorcana, One Piece, and Riftbound — with tcgdex history (November 2022 onwards) still supplementing Pokémon. See [Rarebox Data](/data/rarebox-data) for consuming the same series in your own app.

### Chart Ranges

| Range | Duration | X-Axis Labels |
|-------|----------|---------------|
| 7D | 7 days | Day names |
| 1M | 30 days | Day names |
| 6M | 180 days | Month names |
| 1Y | 365 days | Month names |
| 3Y | 1095 days | Month names |

Ranges use exact day counts, not fractional years. The x-axis label format switches based on range — shorter ranges show individual days, longer ranges show months.

### Variant Selector

The price chart includes a variant selector that lets you switch between different card variants:

- Normal
- Holofoil
- Reverse Holofoil
- 1st Edition Holofoil
- Unlimited
- And other TCG-specific variants

Each variant has its own price history series.

## Portfolio Value Chart

The dashboard shows a portfolio value-over-time chart combining all portfolios. Each portfolio's line uses its assigned color.

### LOCF (Last Observation Carried Forward)

Not every item has a price update every day. The portfolio chart uses **LOCF** to fill gaps: if an item's price wasn't fetched on a given day, the chart carries forward the last known price. This prevents artificial dips in portfolio value when an API was temporarily unavailable.

## Daily Price Snapshots

On every app load, Rarebox records the current price of each **sealed product** and **graded slab** in your portfolios. These snapshots are the data source for the portfolio value chart.

### How Snapshots Work

1. App loads → store initializes from IndexedDB
2. For each sealed/graded item, if no snapshot exists for today's date, record one
3. Snapshots use cached prices only — **zero additional API calls**
4. Snapshots are keyed by date string (YYYY-MM-DD), not timestamp

### Retention

Snapshots are retained for **3 years** (1095 entries per item at daily resolution). Older entries are pruned automatically.

### Staleness Detection

Each item tracks a `lastRefreshed` timestamp updated on every successful price fetch. Staleness thresholds vary by item type:

| Type | Threshold |
|------|-----------|
| Card | 24 hours |
| Sealed | 12 hours |
| Graded | 12 hours |

Items past their threshold show an amber indicator. Items that have **never** been successfully priced show a distinct "price unavailable" state rather than a stale indicator.

### Cleanup

When you delete an item from a portfolio, its snapshot history is cleaned up automatically. Orphaned snapshot entries don't accumulate.

## API Optimization

The price system is designed to minimize API calls:

- **404 caching:** Cards that return 404 from pokemontcg.io are cached as misses — no repeated lookups
- **Chart rebuild debouncing:** 300ms debounce prevents rapid re-renders when multiple prices update
- **Daily snapshots use cached prices only** — the snapshot recording step never triggers new API calls
- **Batched requests:** Max 3–5 concurrent API calls to avoid burst scraping patterns
- **Retry with backoff:** 2 retries with 1s/2s delays on transient errors (429, 5xx, timeout)
- **15s timeout:** All external fetches abort after 15 seconds
- **Card database caching:** Preloaded card data stored in IndexedDB with in-memory index for O(1) lookup

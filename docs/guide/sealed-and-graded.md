# Sealed Products & Graded Slabs

Rarebox tracks three types of collectibles: raw cards, sealed products, and graded slabs. Each uses a different pricing source and has different staleness thresholds.

## Sealed Products

Sealed products include booster boxes, Elite Trainer Boxes (ETBs), tins, blister packs, and other factory-sealed items. Prices are fetched from **PriceCharting** directly in the browser — no backend proxy needed.

### Supported Products
Any Pokémon TCG sealed product listed on PriceCharting. Search by product name and Rarebox matches against PriceCharting's catalog.

### Pricing
PriceCharting provides current market values based on recent sales data. Prices are fetched via their JSON API. Sealed product prices can be volatile around new releases and YouTube opening content, so the staleness threshold is set to **12 hours** (vs. 24 hours for raw cards).

## Graded Slabs

Graded slabs are professionally graded cards encased in tamper-proof holders. Rarebox supports four grading companies:

- **PSA** (Professional Sports Authenticator)
- **BGS** (Beckett Grading Services)
- **CGC** (Certified Guaranty Company)
- **ACE** (ACE Grading)

### Grade-Specific Pricing
Prices vary significantly by grade. A PSA 10 Charizard VMAX Alt Art might be worth 5-10x more than the same card at PSA 7. Rarebox fetches grade-specific pricing from PriceCharting — you select both the card and the grade, and get the market value for that exact combination.

### Staleness Threshold
Graded slab prices use the same **12-hour** staleness threshold as sealed products, since graded card values can shift quickly on auction results.

## Price Snapshots

Both sealed products and graded slabs participate in the daily price snapshot system. On app load, Rarebox records the current price of each item. These snapshots power the portfolio value-over-time chart, with up to 3 years of history retained.

See [Price Charts & Snapshots](/guide/price-charts) for details on how the snapshot system works.

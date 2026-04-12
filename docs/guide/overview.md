# Overview

Rarebox is a privacy-first Pokémon TCG portfolio tracker that runs entirely in your browser. It tracks cards, sealed products (booster boxes, ETBs, tins), and graded slabs (PSA / BGS / CGC / ACE) with live market prices and portfolio value charts.

**Live at [rarebox.io](https://rarebox.io)** · **Source on [GitHub](https://github.com/novaoc/rarebox)**

## Why Rarebox?

Most TCG portfolio tools require accounts, store your data on their servers, and lock you into their ecosystem. Rarebox takes a different approach:

- **No accounts.** No email, no password, no sign-up flow. Open the app and start tracking.
- **No server-side storage.** Your collection lives in IndexedDB in your browser. Price data is fetched directly from public APIs.
- **No tracking.** Vercel Analytics collects anonymized page views and Core Web Vitals — no cookies, no cross-site tracking, no PII.
- **Open source.** MIT licensed. Fork it, modify it, self-host it.

## What it does

### Portfolio Tracking
Create multiple named portfolios, each with a color and their own value chart. Add cards by searching any set, add sealed products and graded slabs with grade-specific pricing. See total collection value, cost basis, and gain/loss across all portfolios.

### Deck Builder
Create decks, cross-reference against your collection to see which cards you already own, calculate cost to complete, and import current meta decks from Limitless TCG with one click.

### Browse & Search
Browse every English and Japanese TCG set with logos, series, release dates, and card counts. Search cards by name across all sets with live results. Japanese cards show images from tcgdex CDN with CardMarket EUR→USD converted prices.

### Price Charts
Card price history going back to November 2022. Portfolio value-over-time charts using a last-observation-carried-forward (LOCF) system. Daily price snapshots for sealed and graded items with 3 years of history retention.

### Backup & Transfer
Export to Excel, backup as JSON, transfer between devices via gzip-compressed QR code or clipboard. Your data is portable.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite |
| State | Pinia |
| Persistence | Dexie.js (IndexedDB) |
| Charts | ApexCharts |
| Routing | Vue Router (HTML5 history mode) |
| Export | SheetJS (xlsx) |
| Serverless API | Python (Vercel Functions) — httpx + BeautifulSoup |
| Hosting | Vercel |

### External APIs

| API | Purpose |
|-----|---------|
| [pokemontcg.io](https://pokemontcg.io) | Card data + live TCGPlayer market prices |
| [tcgdex](https://tcgdex.dev) | Japanese sets/cards, price history (Nov 2022+) |
| [PriceCharting](https://www.pricecharting.com) | Sealed product + graded slab prices |
| [Limitless TCG](https://limitlesstcg.com) | Tournament meta deck data |
| [Pokellector](https://pokellector.com) | Japanese set logos |

## Next Steps

- **Using Rarebox?** Start with [Getting Started](/guide/getting-started)
- **Contributing?** Jump to [Development Setup](/contributing/setup)
- **Understanding the code?** Read [Project Structure](/architecture/project-structure)

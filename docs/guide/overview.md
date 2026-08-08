# Overview

Rarebox is a privacy-first multi-TCG collection tracker that runs entirely in your browser. It tracks cards, sealed products (booster boxes, ETBs, tins), and graded slabs (PSA / BGS / CGC / ACE) across Pokémon, Magic: The Gathering, Yu-Gi-Oh!, Disney Lorcana, One Piece, and Riftbound — with live market prices and shelf value charts.

**Live at [rarebox.io](https://rarebox.io)** · **Source on [GitHub](https://github.com/novaoc/rarebox)**

Since v1.4.0 the app wears **[Tactile](/design/tactile)** — a custom design system with a bottom tab bar on phones/foldables/tablets and a top bar on desktop. **v1.5.0 redesigned the whole information architecture around it**: the tabs are now Home · Shelf · **Add** · Sets · Trade, with the raised pink disc opening a three-button fan — Scan card (camera → on-device identification → prefilled add), Search, and Sealed. Home reads in the collector's daily order — value → change → progress → wants — with movers, binder-completion rows ("≈ $X to finish", one-tap "Want the rest"), and your top hunts. Card details open as a grab-handle bottom sheet with a quantity stepper and physical grade key-caps. Five alternative design prototypes remain live at [rarebox.io/designs](https://rarebox.io/designs).

## Why Rarebox?

Most TCG portfolio tools require accounts, store your data on their servers, and lock you into their ecosystem. Rarebox takes a different approach:

- **No accounts.** No email, no password, no sign-up flow. Open the app and start tracking.
- **No server-side storage.** Your collection lives in IndexedDB in your browser. Price data is fetched directly from public APIs.
- **No tracking. At all.** No analytics, no page-view counting, no cookies, no fingerprinting — the app ships zero tracking scripts. It works fully offline, which is the proof: your collection never needs to talk to a server.
- **Open source.** MIT licensed. Fork it, modify it, self-host it.

## What it does

### Shelf Tracking
Create multiple named shelves (Rarebox speaks collector, not investor), each with a color and their own value chart. Add cards by searching any set, add sealed products and graded slabs with grade-specific pricing. See total collection value, cost basis, and gain/loss across all shelves.

### Multi-TCG Support
Six trading card games are supported out of the box:

| TCG | Card Source | Price Source | Notes |
|-----|------------|--------------|-------|
| Pokémon | pokemontcg.io + TCGplayer supplements | TCGPlayer market | English + Japanese, incl. promo sets pokemontcg.io lacks and JP secret rares |
| Magic: The Gathering | Scryfall | Scryfall USD prices | Paper cards only |
| Yu-Gi-Oh! | YGOPRODeck | TCGPlayer | All rarities |
| Disney Lorcana | Lorcast | Lorcast USD prices | All sets |
| One Piece | optcgapi | TCGPlayer (EN) · PriceCharting (JP) | English + Japanese sets |
| Riftbound | riftcodex | TCGPlayer | Images from Riot CDN |

Card search runs one query brain everywhere: set codes, collector numbers, rarities, nicknames, and typo rescue — with Japanese printings appearing on every Pokémon query. When a primary catalog API goes down, the app transparently falls back to the **[open dataset](/data/rarebox-data)** it publishes daily, so Browse keeps working through upstream outages.

### Deck Builder
Create decks for any TCG, cross-reference against your collection to see which cards you already own, calculate cost to complete, and import current meta decks from Limitless TCG with one click. Meta decks are available for all 6 TCGs.

### Trade Analyzer
Compare Side A vs Side B trade proposals with fair market values. Supports grading (PSA / BGS / CGC / SGC with grades 1–10), cost basis tracking, and a fairness meter that calculates percentage difference between sides. Share trade analysis via Web Share API.

### Card Scanning
Point your camera at a physical card — Tesseract.js OCR extracts the card name, then multi-TCG search resolves it against all providers. Add the scanned card to your portfolio in seconds. Supports Pokémon, MTG, and Lorcana cards.

### Price Alerts
Set price thresholds on any card (above or below a target price). Rarebox checks alerts after price refreshes and fires browser notifications when thresholds are crossed. Alerts are stored locally and persist across sessions.

### Browse & Search
Browse every English and Japanese Pokémon set with logos, series, release dates, and card counts. Browse MTG, Yu-Gi-Oh!, Lorcana, One Piece, and Riftbound sets via the generic TCG browse system. Multi-TCG search across all 6 games with TCG filter pills.

### Price Charts
Card price history going back to November 2022. Shelf value-over-time charts using a last-observation-carried-forward (LOCF) system. Daily price snapshots for sealed and graded items with 3 years of history retention.

### Backup & Transfer
Export to Excel, backup as JSON, transfer between devices via gzip-compressed QR code or clipboard. Import from Collectr (CSV/XLSX) to migrate from other tools. Your data is portable.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vue 3 + Vite |
| State | Pinia |
| Persistence | Dexie.js (IndexedDB) |
| Charts | ApexCharts |
| Routing | Vue Router (HTML5 history mode) |
| Export | SheetJS (xlsx) |
| OCR | Tesseract.js |
| Compression | pako (gzip) |
| QR Codes | qrcode (base64 generation) |
| Serverless API | Python (Vercel Functions) — httpx + BeautifulSoup |
| Hosting | Vercel |

### External APIs

| API | Purpose |
|-----|---------|
| [pokemontcg.io](https://pokemontcg.io) | Card data + live TCGPlayer market prices |
| [tcgdex](https://tcgdex.dev) | Japanese sets/cards, price history (Nov 2022+) |
| [Scryfall](https://scryfall.com) | Magic: The Gathering sets/cards/prices |
| [YGOPRODeck](https://ygoprodeck.com) | Yu-Gi-Oh! card data + prices |
| [Lorcast](https://lorcast.com) | Disney Lorcana sets/cards/prices |
| [optcgapi](https://optcgapi.com) | One Piece sets/cards/market prices |
| [riftcodex.com](https://riftcodex.com) | Riftbound sets/cards/images (no prices) |
| [PriceCharting](https://www.pricecharting.com) | Sealed + graded prices, non-Pokémon card prices |
| [Limitless TCG](https://limitlesstcg.com) | Tournament meta deck data |
| [Pokellector](https://pokellector.com) | Japanese set logos |

## Next Steps

- **Using Rarebox?** Start with [Getting Started](/guide/getting-started)
- **Contributing?** Jump to [Development Setup](/contributing/setup)
- **Understanding the code?** Read [Project Structure](/architecture/project-structure)

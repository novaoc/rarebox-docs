# Getting Started

Rarebox works in any modern browser — no installation required. Open [rarebox.io](https://rarebox.io) and you're ready to go.

## First Visit

New users see a landing page with feature highlights and a call to action. On first use, Rarebox prompts you to select which TCGs you collect — this determines which card databases are preloaded in the background. Once you add your first item, you'll go straight to the dashboard on future visits.

## Adding Your First Card

1. Click **Search** in the navigation
2. Type a card name (e.g., "Charizard ex")
3. Browse results — each card shows its image and current market price
4. Click **Add** to add it to your active portfolio
5. Enter the price you paid (cost basis) and quantity

The card now appears in your portfolio with live market value, gain/loss, and percentage change.

## Adding Sealed Products

1. From the dashboard, click **Add Item**
2. Switch to the **Sealed** tab
3. Search for a product (e.g., "Obsidian Flames Booster Box")
4. Prices and images are fetched from PriceCharting
5. Enter your cost basis and add to portfolio

## Adding Graded Slabs

1. From **Add Item**, switch to the **Graded** tab
2. Search for the card
3. Select the grading company (PSA / BGS / CGC / ACE) and grade
4. Grade-specific pricing is pulled from PriceCharting

## Creating Multiple Portfolios

You might want separate portfolios for different purposes — one for your personal collection, one for investment holds, one for cards you're considering selling.

Click the portfolio name dropdown to create new portfolios. Each gets its own name, color, and independent value chart.

## Bulk Import

Have a PTCGL or PTCGO deck list? Paste the entire list into the **Bulk Import** tool and add all cards at once. The importer matches card names and set codes against the pokemontcg.io database.

## Collectr Import

Migrating from Collectr? Go to **Settings → Import from Collectr** and upload your CSV or XLSX export. Rarebox parses card names, sets, quantities, conditions, grading info, and cost data. Japanese cards, graded slabs, and sealed products are all handled automatically.

## Scanning Cards

Use the camera scanner to add cards quickly:

1. Click the scan icon in the Search view
2. Point your camera at a physical card
3. Tesseract.js OCR extracts the card name
4. Multi-TCG search resolves the card instantly
5. Add the resolved card to your portfolio

## Building Decks

1. Navigate to **Decks** (top bar on desktop, More menu on mobile)
2. Select a TCG and create a new deck
3. Search for cards and add them with quantities
4. The deck builder shows which cards you own vs. need
5. Import meta decks from Limitless TCG with one click

## Trade Analysis

1. Navigate to **Trade** (top bar on desktop, the raised center tab on mobile)
2. Add items to Side A and Side B
3. Use camera scan or search to add cards
4. The fairness meter shows if the trade is balanced
5. Share the analysis via Web Share API

## Setting Price Alerts

1. Open any card's detail view
2. Click **Set Alert**
3. Choose above or below a target price
4. Rarebox notifies you via browser notification when the threshold is crossed

## Installing as an App

Rarebox is a PWA (Progressive Web App) and can be installed on your home screen:

- **Android:** Chrome will show a native install prompt. Tap "Add to Home Screen."
- **iOS:** In Safari, tap Share → "Add to Home Screen." Rarebox shows a step-by-step guide for this.

Once installed, it runs as a standalone app without the browser chrome.

## Next Steps

- [Managing portfolios](/guide/portfolios) — editing, deleting, combining portfolios
- [Sealed & graded items](/guide/sealed-and-graded) — how PriceCharting integration works
- [Deck builder](/guide/deck-builder) — building decks and importing meta decks
- [Price charts](/guide/price-charts) — understanding the snapshot system

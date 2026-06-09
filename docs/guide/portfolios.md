# Portfolios

Rarebox supports multiple named portfolios, each with a color and their own value chart. The dashboard combines all portfolios into a single view showing total collection value, cost basis, and gain/loss.

## Creating a Portfolio

Click the portfolio dropdown in the header and select **New Portfolio**. Give it a name and pick a color — the color appears in the dashboard charts so you can distinguish between portfolios at a glance.

## Portfolio Items

Each item in a portfolio tracks:

- **Card/product identity** — name, set, image, type (card / sealed / graded), game (pokemon / mtg / yugioh / lorcana / one-piece / riftbound)
- **Cost basis** — what you paid
- **Quantity** — how many you own
- **Current market price** — fetched live from the appropriate API for the TCG
- **Gain/loss** — absolute and percentage, calculated from cost basis vs. current price

## Multi-TCG Portfolios

A single portfolio can contain items from any of the 6 supported TCGs. Each item tracks which game it belongs to via the `game` field. Price refresh fans out to the appropriate API based on the game:

- **Pokémon:** pokemontcg.io (TCGPlayer market prices)
- **MTG:** PriceCharting (via priceFeedService)
- **Yu-Gi-Oh!:** PriceCharting (via priceFeedService)
- **Lorcana:** PriceCharting (via priceFeedService)
- **One Piece:** PriceCharting (via priceFeedService)
- **Riftbound:** PriceCharting (via priceFeedService)

## Dashboard

The dashboard view shows:

- Total portfolio value across all portfolios
- Total cost basis
- Total gain/loss (absolute + percentage)
- Portfolio value-over-time chart (combined and per-portfolio)
- Individual portfolio breakdowns
- Quick actions (add card, import, browse sets)

## Editing Items

Click any item in the portfolio table to edit quantity, cost basis, or to remove it. Changes persist immediately via debounced writes to IndexedDB.

## Grouping & Sorting

The portfolio view supports grouping items by:

- **Game** — see all Pokémon cards together, all MTG cards together, etc.
- **Set** — group by TCG set
- **Type** — cards vs. sealed vs. graded
- **Year** — group by purchase year

Sorting options include name, value, date added, and cost basis.

## Deleting a Portfolio

Deleting a portfolio removes all its items, associated snapshots, and price history data. This action is irreversible — export or backup first if you want to keep the data.

::: warning
Deleted items are cleaned up from snapshots automatically. The stale data cleanup runs on portfolio mutations to prevent orphaned snapshot entries from accumulating.
:::

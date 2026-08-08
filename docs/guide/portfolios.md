# Shelves

Rarebox organizes your collection into **shelves** — multiple named groups, each with a color and its own value chart. The dashboard combines all shelves into a single view showing total collection value, cost basis, and gain/loss.

::: tip Why "shelf"?
Most trackers call these *shelves*, and that word carries the wrong energy — Rarebox is a tool for collectors and hobbyists, not fund managers. A shelf is what your cards actually live on: the binder shelf, the slab shelf, the "do not touch" shelf. Same data, friendlier vocabulary. (You'll still see `shelf` in code, URLs, and exports' internals — the rename is purely how the app speaks.)
:::

## Creating a Shelf

Click the shelf dropdown in the header and select **New Shelf**. Give it a name and pick a color — the color appears in the dashboard charts so you can distinguish between shelves at a glance.

## Shelf Items

Each item in a shelf tracks:

- **Card/product identity** — name, set, image, type (card / sealed / graded), game (pokemon / mtg / yugioh / lorcana / one-piece / riftbound)
- **Cost basis** — what you paid
- **Quantity** — how many you own
- **Current market price** — fetched live from the appropriate API for the TCG
- **Gain/loss** — absolute and percentage, calculated from cost basis vs. current price

## Multi-TCG Shelves

A single shelf can contain items from any of the 6 supported TCGs. Each item tracks which game it belongs to via the `game` field. Price refresh fans out to the appropriate API based on the game:

- **Pokémon:** pokemontcg.io (TCGPlayer market prices)
- **MTG:** PriceCharting (via priceFeedService)
- **Yu-Gi-Oh!:** PriceCharting (via priceFeedService)
- **Lorcana:** PriceCharting (via priceFeedService)
- **One Piece:** PriceCharting (via priceFeedService)
- **Riftbound:** PriceCharting (via priceFeedService)

## Dashboard

The dashboard view shows:

- Total shelf value across all shelves
- Total cost basis
- Total gain/loss (absolute + percentage)
- Shelf value-over-time chart (combined and per-shelf)
- Individual shelf breakdowns
- Quick actions (add card, import, browse sets)

## Editing Items

Click any item in the shelf table to edit quantity, cost basis, or to remove it. Changes persist immediately via debounced writes to IndexedDB.

Since v1.5, the item detail opens as a **grab-handle bottom sheet** on phones (tap or swipe the handle down to dismiss) with the card art in a framed, slightly tilted mat. Quantity is a mechanical stepper and a graded slab's company + grade are physical key-caps — every press persists instantly, no Save button.

**Shelves self-heal.** Price refresh fetches the full card, so items that were saved without a picture or set name (old imports, bulk paste) get their missing images and metadata backfilled automatically on the next refresh — stored values are never overwritten.

## Grouping & Sorting

The shelf view supports grouping items by:

- **Game** — see all Pokémon cards together, all MTG cards together, etc.
- **Set** — group by TCG set
- **Type** — cards vs. sealed vs. graded
- **Year** — group by purchase year

Sorting options include name, value, date added, and cost basis.

## Deleting a Shelf

Deleting a shelf removes all its items, associated snapshots, and price history data. This action is irreversible — export or backup first if you want to keep the data.

::: warning
Deleted items are cleaned up from snapshots automatically. The stale data cleanup runs on shelf mutations to prevent orphaned snapshot entries from accumulating.
:::

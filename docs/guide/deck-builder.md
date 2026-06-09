# Deck Builder

The deck builder lets you create and manage competitive TCG decks alongside your collection. It supports all 6 TCGs — Pokémon, MTG, Yu-Gi-Oh!, Lorcana, One Piece, and Riftbound — and cross-references deck lists against your portfolios so you can see what you own and what you still need to buy.

## Creating a Deck

1. Navigate to **Decks** in the sidebar
2. Select a TCG from the game filter pills
3. Click **New Deck** and give it a name
4. Search for cards and add them with one click
5. Adjust quantities with the +/− controls

## Ownership Tracking

Each card in a deck shows one of three states:

- **Need** — you don't own this card in any portfolio
- **Owned** — you own it but haven't marked it
- **✓ Owned** — confirmed owned

Ownership is cross-referenced against **all portfolios** and only counts **raw cards** (not graded slabs — you wouldn't sleeve a PSA 10 into a deck).

## Cost Calculation

The deck builder calculates the total cost to complete the deck — the sum of market prices for all cards you still **Need**. This gives you a quick answer to "how much would it cost me to build this deck right now?"

## Completion Percentage

A progress bar shows how close you are to having every card in the deck, based on ownership status.

## Meta Decks

Rarebox fetches current tournament meta data from **Limitless TCG** and shows the top competitive decks ranked by meta share and championship points. Meta decks are available for all 6 TCGs.

### How Meta Decks Work

1. The `metaDecksApi` service fetches live data from the serverless endpoint (`/api/search`)
2. Core cards are resolved server-side with exact card match (set code + number)
3. Market prices for every card are fetched from the appropriate TCG API
4. Results are cached in localStorage for 24 hours — instant on repeat visits
5. If the live endpoint is unavailable, static fallback decks are shown

### Importing a Meta Deck

Click any meta deck to see its full card list. Click **Import** to copy it into your deck builder as a new deck. You can then customize it and track ownership against your collection.

## Multi-TCG Deck Support

Each deck has a `game` field that determines which TCG's cards it contains. The deck builder uses `multiSearch` to find cards across all providers, so you can search for MTG cards in an MTG deck, Yu-Gi-Oh! cards in a Yu-Gi-Oh! deck, and so on.

Card images and prices are resolved from the appropriate API for the deck's game.

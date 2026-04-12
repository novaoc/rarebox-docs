# Deck Builder

The deck builder lets you create and manage competitive Pokémon TCG decks alongside your collection. It cross-references deck lists against your portfolios so you can see what you own and what you still need to buy.

## Creating a Deck

1. Navigate to **Decks** in the sidebar
2. Click **New Deck** and give it a name
3. Search for cards and add them with one click
4. Adjust quantities with the +/− controls

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

Rarebox fetches current tournament meta data from **Limitless TCG** and shows the top 8 competitive decks ranked by meta share and championship points.

### How Meta Decks Work

1. The `/api/search` serverless function scrapes Limitless TCG for current meta standings
2. Core cards are resolved server-side with exact card match (set code + number)
3. Market prices for every card are fetched from TCGPlayer via pokemontcg.io
4. Results are cached for 24 hours — instant on repeat visits

### Importing a Meta Deck

Click any meta deck to see its full card list. Click **Import** to copy it into your deck builder as a new deck. You can then customize it and track ownership against your collection.

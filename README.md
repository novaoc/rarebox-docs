# Rarebox Docs

Documentation site for [Rarebox](https://rarebox.io) — the privacy-first multi-TCG portfolio tracker.

Covers the user guide, the **Tactile design system & branding guidelines** (`/design/tactile`), architecture, API integrations, and contributing docs. Updated for Rarebox v1.4.0 (the Tactile release).

**Live at [docs.rarebox.io](https://docs.rarebox.io)**

Built with [VitePress](https://vitepress.dev).

## Development

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Build

```bash
npm run build
```

Output in `docs/.vitepress/dist/`.

## Structure

```
docs/
├── index.md                    # Landing page
├── guide/                      # User-facing documentation
│   ├── overview.md             # What Rarebox does, tech stack, APIs
│   ├── getting-started.md      # First visit, adding cards, scanning, decks
│   ├── portfolios.md           # Multi-TCG portfolios, grouping, sorting
│   ├── sealed-and-graded.md    # Sealed products, graded slabs, pricing
│   ├── deck-builder.md         # Multi-TCG decks, ownership, meta decks
│   ├── price-charts.md         # Price history, LOCF, snapshots
│   ├── backup-and-transfer.md  # Export, backup, QR/clipboard, Collectr import
│   └── pwa.md                  # Installation, offline support
├── architecture/               # Developer documentation
│   ├── project-structure.md    # Codebase layout, key files
│   ├── data-flow.md            # Pinia → IDB, card preload, multi-TCG search
│   ├── api-integrations.md     # All 9 external APIs documented
│   ├── serverless.md           # Vercel Functions, meta deck scraping
│   ├── snapshots.md            # Price snapshot system internals
│   └── components.md           # All Vue components and patterns
├── contributing/               # Contributor guides
│   ├── setup.md                # Dev environment, adding TCGs/APIs
│   ├── code-style.md           # Conventions, patterns, error handling
│   ├── pull-requests.md        # PR guidelines
│   └── rate-limits.md          # API rate limits
└── reference/                  # Technical reference
    ├── data-schema.md          # All data structures (Portfolio, Deck, Trade, etc.)
    ├── env-vars.md             # Environment variables
    └── deployment.md           # Vercel deployment, self-hosting
```

## Supported TCGs

Pokémon, Magic: The Gathering, Yu-Gi-Oh!, Disney Lorcana, One Piece, Riftbound

## License

MIT

# Rarebox Docs

Documentation site for [Rarebox](https://rarebox.io) — the privacy-first Pokémon TCG portfolio tracker.

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
│   ├── overview.md
│   ├── getting-started.md
│   ├── portfolios.md
│   ├── sealed-and-graded.md
│   ├── deck-builder.md
│   ├── price-charts.md
│   ├── backup-and-transfer.md
│   └── pwa.md
├── architecture/               # Developer documentation
│   ├── project-structure.md
│   ├── data-flow.md
│   ├── api-integrations.md
│   ├── serverless.md
│   ├── snapshots.md
│   └── components.md
├── contributing/               # Contributor guides
│   ├── setup.md
│   ├── code-style.md
│   ├── pull-requests.md
│   └── rate-limits.md
└── reference/                  # Technical reference
    ├── data-schema.md
    ├── env-vars.md
    └── deployment.md
```

## License

MIT

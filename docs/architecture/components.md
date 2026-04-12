# Component Guide

This page documents the key Vue components in Rarebox, their responsibilities, and the patterns they follow.

## Component Patterns

### Bottom Sheet (Mobile)

On mobile devices, detail panels and modals use a bottom sheet pattern — they slide up from the bottom of the screen with a drag handle and rounded corners.

**Detection:** The `@media (hover: none)` media query identifies touch devices. On these devices:
- Card detail panels slide up as bottom sheets
- AddItem and BulkImport modals render as full-width bottom sheets
- Overlay buttons (Add/Details) on card grids are always visible (no hover required)

### Card Grid

The card grid is responsive and adapts to screen size. On desktop, cards show overlay buttons on hover. On mobile (touch), overlay buttons are always visible since there's no hover state.

### Responsive Table

The portfolio table progressively hides columns on smaller screens:
- **Desktop:** All columns visible
- **Tablet:** Hides Type and Actions columns
- **Phone:** Also hides gain% column

## Key Components

### Layout & Navigation

| Component | Path | Purpose |
|-----------|------|---------|
| `App.vue` | `src/App.vue` | Root component. Initializes store, renders sidebar nav, topbar with page title, tour replay info icon, and router view. Contains New Portfolio modal. |
| `InstallPrompt.vue` | `src/components/InstallPrompt.vue` | PWA install prompt. Detects platform (Android/iOS). Android shows native install button; iOS shows step-by-step guide modal. Auto-hides in standalone mode. |
| `TourModal.vue` | `src/components/TourModal.vue` | Feature tour video modal. Plays mp4 on first visit, keyed by localStorage. Replayable via info icon in topbar. Full-width bottom sheet on mobile. |

### Portfolio Views

| Component | Path | Purpose |
|-----------|------|---------|
| `DashboardView.vue` | `src/views/DashboardView.vue` | Combined overview of all portfolios. Shows total value, cost basis, gain/loss. Price refresh for all items. |
| `PortfolioView.vue` | `src/views/PortfolioView.vue` | Single portfolio detail. Item table with inline editing (name, purchase price, quantity). Portfolio chart. Item detail panel (bottom sheet on mobile). Price refresh per-portfolio. |
| `AddItemModal.vue` | `src/components/AddItemModal.vue` | Modal for adding cards, sealed products, or graded slabs. Three-step flow: type selection → search → configure. Card search uses pokemontcg.io. Sealed/graded search uses PriceCharting. Bottom sheet on mobile. |
| `BulkImportModal.vue` | `src/components/BulkImportModal.vue` | Paste a PTCGL/PTCGO deck list to bulk add cards. Parses card names, sets, quantities. Resolves against pokemontcg.io. Bottom sheet on mobile. |
| `PortfolioChart.vue` | `src/components/PortfolioChart.vue` | Portfolio value-over-time chart using ApexCharts. LOCF algorithm across all items. 7D/1M/6M/1Y/3Y range selector. Chart header stacks vertically on mobile. |

### Search & Browse

| Component | Path | Purpose |
|-----------|------|---------|
| `SearchView.vue` | `src/views/SearchView.vue` | Card search across all sets. Live results with images and prices. Click to add or view details. Overlay buttons always visible on touch. |
| `SetsView.vue` | `src/views/SetsView.vue` | Browse all TCG sets (English/Japanese toggle). Click into a set to see paginated card grid. Set ownership badges ("30/130"). Detail panel is bottom sheet on mobile. |
| `PriceChart.vue` | `src/components/PriceChart.vue` | Individual card price history chart. Fetches from tcgdex price-history repo. 7D/1M/6M/1Y/3Y ranges. Chart header stacks on mobile. |

### Deck Builder

| Component | Path | Purpose |
|-----------|------|---------|
| `DeckListView.vue` | `src/views/DeckListView.vue` | Grid of all decks with stats (needed/owned/cost/completion%). Progress bar per deck. Create new deck modal. |
| `DeckBuilderView.vue` | `src/views/DeckBuilderView.vue` | Two-panel deck editor. Left: card search (pokemontcg.io). Right: deck card list with ownership badges (✓ Owned, partial, Need). Quantity +/− controls. Stats bar. |
| `MetaDecksView.vue` | `src/views/MetaDecksView.vue` | Live meta decks from Limitless TCG. Shows top competitive decks. One-click import. Expandable card list per deck. |

### Settings & Utility

| Component | Path | Purpose |
|-----------|------|---------|
| `SettingsView.vue` | `src/views/SettingsView.vue` | Settings page. Export to Excel, JSON backup/restore, QR transfer, price alerts management, reset all data. |
| `TermsView.vue` | `src/views/TermsView.vue` | Terms & Conditions + Privacy Policy. Static content. |
| `LocalSyncModal.vue` | `src/components/LocalSyncModal.vue` | Optional cross-device sync via jsonbin.io (user provides API key). |

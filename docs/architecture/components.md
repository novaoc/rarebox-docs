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

### Route Transitions

The app uses Vue Router's `<RouterView>` with `v-slot` to animate route transitions. Transitions use `mode="out-in"` with a 500ms timeout to prevent hanging if transition events are delayed. Each route uses a `:key` to force fresh component instances on navigation.

## Key Components

### Layout & Navigation

| Component | Path | Purpose |
|-----------|------|---------|
| `App.vue` | `src/App.vue` | Root component. Initializes store, renders sidebar nav, topbar with page title, tour replay info icon, and router view. Contains New Portfolio modal, background card preloader, and global error handler. |
| `InstallPrompt.vue` | `src/components/InstallPrompt.vue` | PWA install prompt. Detects platform (Android/iOS). Android shows native install button; iOS shows step-by-step guide modal. Auto-hides in standalone mode. |
| `TourModal.vue` | `src/components/TourModal.vue` | Feature tour video modal. Plays mp4 on first visit, keyed by localStorage. Replayable via info icon in topbar. Full-width bottom sheet on mobile. |

### Card Database & Loading

| Component | Path | Purpose |
|-----------|------|---------|
| `CardDatabaseLoader.vue` | `src/components/CardDatabaseLoader.vue` | First-run TCG selection modal. Shows card counts per game, estimated sizes, and triggers background preload. Gates first use — user must select games before app is fully functional. |
| `CardLoadIndicator.vue` | `src/components/CardLoadIndicator.vue` | Floating pill showing preload progress. Expandable per-game status, speed/time estimates, minimized by default. Shows cards/sec speed and ETA. |

### Portfolio Views

| Component | Path | Purpose |
|-----------|------|---------|
| `DashboardView.vue` | `src/views/DashboardView.vue` | Combined overview of all portfolios. Shows total value, cost basis, gain/loss. Multi-game portfolio value selector. Price refresh for all items + auto-check price alerts. New user landing page with feature highlights. |
| `PortfolioView.vue` | `src/views/PortfolioView.vue` | Single portfolio detail. Item table with inline editing (name, purchase price, quantity). Portfolio chart. Item detail panel (bottom sheet on mobile). Group-by (game/set/type/year) and sort options. Price refresh per-portfolio. |
| `AddItemModal.vue` | `src/components/AddItemModal.vue` | Modal for adding cards, sealed products, or graded slabs. Three-step flow: type selection → search → configure. Card search uses pokemontcg.io. Sealed/graded search uses PriceCharting. Bottom sheet on mobile. |
| `BulkImportModal.vue` | `src/components/BulkImportModal.vue` | Paste a PTCGL/PTCGO deck list to bulk add cards. Parses card names, sets, quantities. Resolves against pokemontcg.io. Bottom sheet on mobile. |
| `PortfolioChart.vue` | `src/components/PortfolioChart.vue` | Portfolio value-over-time chart using ApexCharts. LOCF algorithm across all items. 7D/1M/6M/1Y/3Y range selector. Chart header stacks vertically on mobile. |

### Search & Browse

| Component | Path | Purpose |
|-----------|------|---------|
| `SearchView.vue` | `src/views/SearchView.vue` | Multi-TCG card search across all 6 games. Fan-out to all providers in parallel. TCG filter pills. Add-to-portfolio modal. Price chart per card. Overlay buttons always visible on touch. |
| `SetsView.vue` | `src/views/SetsView.vue` | Browse Pokémon sets (English/Japanese toggle). Click into a set to see paginated card grid. Set ownership badges ("30/130"). Detail panel is bottom sheet on mobile. |
| `TcgSetsView.vue` | `src/views/TcgSetsView.vue` | Generic TCG sets browse for MTG, Yu-Gi-Oh!, Lorcana, One Piece, and Riftbound. Same grid/card pattern as SetsView but uses the generic provider system. |
| `BrowseView.vue` | `src/views/BrowseView.vue` | TCG selector landing page. Tile grid linking to sets views per game. Pokémon links to SetsView, others to TcgSetsView. |
| `PriceChart.vue` | `src/components/PriceChart.vue` | Individual card price history chart. Fetches from tcgdex price-history repo. 7D/1M/6M/1Y/3Y ranges. Variant selector (normal/holo/reverse/1st ed). Chart header stacks on mobile. |

### Deck Builder

| Component | Path | Purpose |
|-----------|------|---------|
| `DeckListView.vue` | `src/views/DeckListView.vue` | Grid of all decks with stats (needed/owned/cost/completion%). Game filter pills. Progress bar per deck. Create new deck modal. |
| `DeckBuilderView.vue` | `src/views/DeckBuilderView.vue` | Two-panel deck editor. Left: card search (multiSearch). Right: deck card list with ownership badges (✓ Owned, partial, Need). Quantity +/− controls. Stats bar. Game selector for multi-TCG decks. |
| `MetaDecksView.vue` | `src/views/MetaDecksView.vue` | Live meta decks from Limitless TCG. Multi-game tabs. Shows top competitive decks. One-click import. Expandable card list per deck. |

### Trade Analyzer

| Component | Path | Purpose |
|-----------|------|---------|
| `TradeLanding.vue` | `src/views/TradeLanding.vue` | Trade analyzer intro/landing page. Hero, features, CTA to start analyzing trades. |
| `TradeAnalyzerView.vue` | `src/views/TradeAnalyzerView.vue` | Side A vs Side B comparison. Camera scan + search per side. Grading support (PSA/BGS/CGC/SGC with grades 1–10). Fairness meter. Share analysis. Cost basis tracking. |
| `CameraViewfinder.vue` | `src/components/scanner/CameraViewfinder.vue` | Camera capture via getUserMedia. Rear camera preferred. Canvas frame capture. File upload fallback. Torch/flash toggle. Permission handling. |

### Settings & Utility

| Component | Path | Purpose |
|-----------|------|---------|
| `SettingsView.vue` | `src/views/SettingsView.vue` | Settings page. Storage info, card database refresh, price cache clear, data export/import, Collectr import, reset all data, tour replay, PWA install, PriceCharting API key input. |
| `TermsView.vue` | `src/views/TermsView.vue` | Terms & Conditions + Privacy Policy. Static content. |
| `LocalSyncModal.vue` | `src/components/LocalSyncModal.vue` | Device-to-device sync via QR code or clipboard. Gzip-compressed base64 transfer. Send (QR + base64) and receive (camera scan or paste) modes. |
| `PullToRefresh.vue` | `src/components/PullToRefresh.vue` | Touch pull-to-refresh with directional lock. SVG refresh animation. Respects `prefers-reduced-motion`. Emits `refresh` event when threshold crossed. |

# Component Guide

This page documents the key Vue components in Rarebox, their responsibilities, and the patterns they follow.

::: info
This page needs to be filled in by the development team. The structure below outlines what should be documented for each major component.
:::

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

<!-- TODO: Nova — fill in each component with:
  - File path
  - What it does
  - Key props
  - Events emitted
  - Notable implementation details
-->

### Layout & Navigation

| Component | Path | Purpose |
|-----------|------|---------|
| `App.vue` | `src/App.vue` | Root component, initializes store |
| <!-- NavBar --> | <!-- path --> | <!-- Navigation header --> |
| <!-- Sidebar --> | <!-- path --> | <!-- Side navigation --> |

### Portfolio Views

| Component | Path | Purpose |
|-----------|------|---------|
| <!-- Dashboard --> | <!-- path --> | <!-- Combined portfolio overview --> |
| <!-- PortfolioView --> | <!-- path --> | <!-- Single portfolio detail --> |
| <!-- AddItem --> | <!-- path --> | <!-- Modal for adding cards/sealed/graded --> |

### Search & Browse

| Component | Path | Purpose |
|-----------|------|---------|
| <!-- SearchView --> | <!-- path --> | <!-- Card search across all sets --> |
| <!-- SetsView --> | <!-- path --> | <!-- Browse all TCG sets --> |
| <!-- SetDetail --> | <!-- path --> | <!-- Cards within a single set --> |

### Deck Builder

| Component | Path | Purpose |
|-----------|------|---------|
| <!-- DeckView --> | <!-- path --> | <!-- Deck list management --> |
| <!-- MetaDecks --> | <!-- path --> | <!-- Limitless TCG meta deck browser --> |

### Shared

| Component | Path | Purpose |
|-----------|------|---------|
| <!-- CardGrid --> | <!-- path --> | <!-- Responsive card image grid --> |
| <!-- PriceChart --> | <!-- path --> | <!-- ApexCharts price history wrapper --> |
| <!-- BottomSheet --> | <!-- path --> | <!-- Mobile slide-up panel --> |

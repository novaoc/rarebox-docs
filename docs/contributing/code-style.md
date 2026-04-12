# Code Style

Conventions and patterns used across the Rarebox codebase. Follow these when contributing to keep things consistent.

## Vue Components

### Single-File Components

All components use Vue 3 `<script setup>` syntax with the Composition API. No Options API.

```vue
<script setup>
import { ref, computed } from 'vue'
import { usePortfolioStore } from '@/stores/portfolio'

const store = usePortfolioStore()
const searchQuery = ref('')

const filteredItems = computed(() =>
  store.currentPortfolio.items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)
</script>

<template>
  <!-- template here -->
</template>

<style scoped>
/* styles here */
</style>
```

### File Naming

- **Components:** PascalCase — `CardGrid.vue`, `AddItemModal.vue`, `BottomSheet.vue`
- **Views:** PascalCase with `View` suffix — `SearchView.vue`, `SetsView.vue`, `SettingsView.vue`
- **Stores:** camelCase — `portfolio.js`, `deck.js`
- **Composables:** camelCase with `use` prefix — `useCardSearch.js`, `usePriceHistory.js`

### Component Organization

Within a `.vue` file, order sections as:

1. `<script setup>` — imports, props, emits, reactive state, computed, methods, lifecycle hooks
2. `<template>` — markup
3. `<style scoped>` — styles (always scoped unless intentionally global)

## JavaScript

### General

- ES modules (`import`/`export`), no CommonJS
- `const` by default, `let` when reassignment is needed, never `var`
- Arrow functions for callbacks and computed values
- Template literals over string concatenation
- Destructuring for object/array access
- Optional chaining (`?.`) and nullish coalescing (`??`) where appropriate

### Async

- `async`/`await` over raw Promises and `.then()` chains
- Always wrap external API calls in try/catch
- Use the existing retry-with-backoff pattern for API requests

### Naming

- **Variables/functions:** camelCase — `fetchCardPrice`, `isStale`, `lastRefreshed`
- **Constants:** UPPER_SNAKE_CASE for true constants — `MAX_CONCURRENT_REQUESTS`, `SNAPSHOT_RETENTION_DAYS`
- **Boolean variables:** prefix with `is`, `has`, `should` — `isLoading`, `hasNeverPriced`, `shouldRetry`

## CSS

### Scoped Styles

Always use `<style scoped>` unless you have a specific reason for global styles. This prevents style leakage between components.

### Responsive Design

- Mobile-first: base styles target mobile, use `@media` queries to add desktop enhancements
- Touch detection: `@media (hover: none)` for touch-specific behaviors
- Breakpoints used in the project:

```css
/* Mobile → Tablet */
@media (max-width: 768px) { }

/* Touch devices (persistent overlays, bottom sheets) */
@media (hover: none) { }

/* iOS PWA safe areas */
@supports (padding-top: env(safe-area-inset-top)) { }
```

The primary breakpoint is `768px` — everything below is mobile, everything above is desktop. There's no explicit tablet breakpoint; the app uses a two-tier responsive system. Touch detection via `(hover: none)` is used alongside the width breakpoint for mobile-specific behaviors like bottom sheets and persistent overlay buttons.

### Color and Theme

- Use CSS custom properties (variables) for colors and spacing
- Dark mode support via CSS variables — components shouldn't hard-code color values

## Store Patterns

### Mutations Must Persist

Every Pinia store action that changes persistent state must call `this.persist()` at the end. For critical operations, use `this.persistNow()` for an immediate flush.

```js
// Good
addItem(portfolioId, item) {
  const portfolio = this.portfolios.find(p => p.id === portfolioId)
  portfolio.items.push(item)
  this.persist()  // debounced write to IDB
}

// Good — critical operation
resetAll() {
  this.portfolios = [createDefaultPortfolio()]
  this.snapshots = {}
  this.persistNow()  // immediate write
}
```

### API Calls in Stores

API fetching logic lives in store actions, not in components. Components call store actions and read reactive state — they don't make API calls directly.

## Commit Messages

Use clear, descriptive commit messages. No strict format enforced, but prefer:

```
feat: add Japanese set price history charts
fix: prevent duplicate snapshots on rapid page reload
refactor: extract price fetching into composable
docs: add API integration documentation
```

Prefixes: `feat`, `fix`, `refactor`, `docs`, `style`, `perf`, `test`, `chore`

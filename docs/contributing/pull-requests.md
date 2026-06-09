# Pull Request Guidelines

How to contribute changes back to Rarebox.

## Before You Start

1. **Check existing issues** — someone might already be working on the same thing
2. **Open an issue first** for non-trivial changes — discuss the approach before writing code
3. **Fork the repo** and create a feature branch from `main`

## Branch Naming

```
feat/deck-export-csv
fix/snapshot-cleanup-on-delete
docs/api-rate-limits
refactor/price-fetching-composable
```

## Making a PR

### Keep It Focused

One PR should do one thing. A PR that adds a feature, fixes two bugs, and refactors a component is three PRs.

### What to Include

- **Clear title** — what the PR does, not how
- **Description** — explain the change, why it's needed, and any trade-offs
- **Screenshots** — for UI changes, include before/after screenshots (desktop and mobile)
- **Testing notes** — how you tested the change, edge cases considered

### What to Check Before Submitting

- [ ] App builds without errors (`npm run build`)
- [ ] No console errors or warnings in the browser
- [ ] Tested on mobile viewport (Chrome DevTools device mode at minimum)
- [ ] Persistence works — add data, close tab, reopen, data is still there
- [ ] If you changed store logic: verify `persist()` is called after state mutations
- [ ] If you changed API calls: verify caching, timeout, and retry behavior
- [ ] If you changed TCG support: verify all 6 games work (Pokemon, MTG, Yu-Gi-Oh, Lorcana, One Piece, Riftbound)
- [ ] If you added components: verify mobile responsiveness (bottom sheets, touch targets)

### Things That Will Get Your PR Rejected

- **Breaking persistence** — changes that could lose user data are a non-starter
- **Removing privacy features** — Rarebox doesn't send user data to servers. Don't add tracking, analytics beyond what's already there, or server-side storage of collection data
- **Uncached API calls** — every external API call must go through the caching layer
- **Desktop-only UI** — Rarebox has a strong mobile user base. All UI changes must work on mobile
- **Silent errors** — always log errors in catch blocks with `console.warn` or `console.error`
- **Hardcoded game support** — use the TCG identifier field (`game`) instead of hardcoding specific TCGs

## Review Process

1. Submit the PR against `main`
2. The maintainer will review, provide feedback, and may request changes
3. Once approved, the PR is squash-merged into `main`
4. Vercel auto-deploys from `main` — your change goes live immediately after merge

## Good First Issues

Look for issues tagged `good first issue` for approachable contributions. These are typically:

- UI polish or responsive improvements
- Documentation additions
- Small bug fixes with clear reproduction steps
- New export formats
- New TCG provider integrations (follow the pattern in `src/services/tcg/providers.js`)

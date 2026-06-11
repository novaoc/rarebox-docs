# PWA & Offline

Rarebox is a Progressive Web App (PWA) — it can be installed on your device, runs as a standalone app without browser chrome, and **works fully offline** once it has loaded.

## Android

Chrome shows a native install prompt via the `beforeinstallprompt` event. You'll see a banner or an install button in the app UI. Tap it and the app installs to your home screen.

If the prompt doesn't appear, you can install manually: Chrome menu (⋮) → "Add to Home Screen" or "Install app."

## iOS

iOS doesn't support programmatic install prompts, so Rarebox shows a step-by-step guide modal:

1. Open [rarebox.io](https://rarebox.io) in **Safari** (not Chrome — iOS Chrome can't install PWAs)
2. Tap the **Share** button (square with arrow)
3. Scroll down and tap **"Add to Home Screen"**
4. Tap **Add**

## After Installation

- The app runs in standalone mode — no URL bar, no browser tabs
- The install prompt hides automatically once installed (detected via `display-mode: standalone` media query)
- If you dismiss the install prompt, Rarebox remembers your choice in localStorage and won't ask again

## Updates

PWA updates happen automatically in the background. When Rarebox deploys a new version, your installed app will pick it up on the next launch — no manual update needed.

## Offline Support

Rarebox works offline like a binder does — since v1.4.2, the entire app is available with zero connection after your first visit.

Two layers make that work:

1. **Your data was always on-device.** The card database, your shelves, decks, purchase history, and price snapshots live in IndexedDB in your browser — they never depended on a server.
2. **The app itself is now on-device too.** A service worker precaches the app shell (every page, script, and style) on your first visit, so opening Rarebox and moving between Shelf, Search, Browse, Decks, and Trade needs no network at all. Card images are cached as you view them; tour videos and scanner indexes cache on first use.

### What needs a connection

Anything that is *live* by nature — and only that:

- Refreshing prices
- Searching for cards in games you haven't downloaded
- Importing current meta decks
- Loading images for cards you've never viewed before

When you're offline, a chip appears at the bottom of the app: *"Offline — your shelf still works. Live prices & new searches need a connection."* It clears itself the moment you're back online. Cards whose images aren't cached yet wear an **offline sleeve** — a patterned, pastel card back with a monogram sticker and the card's name, generated on the spot from the name itself (the same card always gets the same sleeve). An uncached shelf looks like a deliberate set of alternate-art card backs, not a grid of broken images.

### Implementation notes

The service worker is generated at build time (`scripts/sw-template.js` + a Vite plugin) with the precache manifest injected. Navigations are **network-first** with the cached shell as fallback — so fresh deploys always win when you're online, and updates roll out on the next launch. Hashed assets are cache-first (immutable). Price and search API calls are never intercepted — live data is never served stale. Cross-origin card images are re-requested with CORS where the CDN allows it and skipped otherwise, because opaque responses carry a ~7 MB storage-quota penalty each in Chromium.

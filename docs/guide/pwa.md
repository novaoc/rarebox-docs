# PWA Installation

Rarebox is a Progressive Web App (PWA) — it can be installed on your device and runs as a standalone app without browser chrome.

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

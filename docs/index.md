---
layout: home

hero:
  name: Rarebox
  text: Documentation
  tagline: Privacy-first multi-TCG collection tracker — cards, sealed products, graded slabs, live prices, value charts, deck building, trade analysis, and card scanning. Now wearing Tactile, a custom design system built for collectors.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/overview
    - theme: alt
      text: Architecture
      link: /architecture/project-structure
    - theme: alt
      text: GitHub
      link: https://github.com/novaoc/rarebox

features:
  - icon: 🟡
    title: Tactile Design System
    details: Cream paper, ink lines, hard shadows that compress when pressed. Bottom tab navigation on phones and foldables, top bar on desktop. Verified from 280px foldable covers to desktop. See the Design section for branding guidelines.
    link: /design/tactile
  - icon: ⚡
    title: 10-Second Card Database
    details: 20,000+ Pokémon cards load in about ten seconds via the official bulk dataset; prices stream in through a background pass with automatic resume. And since the whole app works offline, so does search.
  - icon: 📦
    title: Collection Management
    details: Track cards, sealed products, and graded slabs across multiple named shelves — Rarebox speaks collector, not investor with live pricing from TCGPlayer and PriceCharting. Supports Pokémon, MTG, Yu-Gi-Oh!, Lorcana, One Piece, and Riftbound.
  - icon: 🔒
    title: Privacy by Design
    details: All data stored locally in your browser via IndexedDB. No accounts, no server-side storage — your collection never leaves your device.
  - icon: 📡
    title: Works Offline
    details: A service worker precaches the whole app on first visit — shelf, decks, search, and browse all work with zero signal, like a binder. Only live prices and new searches need a connection, and the app says so when they do.
    link: /guide/pwa
  - icon: 📊
    title: Price Charts & Snapshots
    details: Historical price charts, shelf value over time with LOCF, daily price snapshots, and per-type staleness thresholds.
  - icon: 🃏
    title: Deck Builder
    details: Build competitive decks, cross-reference against your collection, track ownership, and import meta decks from Limitless TCG for all 6 TCGs.
  - icon: 🔄
    title: Trade Analyzer
    details: Compare Side A vs Side B with fair market values, grading support (PSA/BGS/CGC/ACE), and a fairness meter for informed trading decisions.
  - icon: 📷
    title: Card Scanning
    details: Point your camera at a card and Rarebox identifies the exact printing in about a second by matching the artwork itself (perceptual hashing — the technique industrial card sorters use), with OCR as fallback. Straight onto your shelf.
  - icon: 🏪
    title: Card Booth
    details: Set up your table for a card show — list what you're selling with your prices and share it as a link or QR. The whole booth travels inside the link itself, no servers involved. Buyers can save shops to revisit, even offline.
    link: /guide/booth
  - icon: 🔔
    title: Price Alerts
    details: Set price thresholds on any card. Get browser notifications when prices cross your target — above or below.
  - icon: 🛠️
    title: Open Source
    details: MIT licensed, fully documented architecture. Fork it, extend it, or contribute back.
  - icon: 🧭
    title: Agentic Engineering
    details: "Rarebox's AI-assisted development workflow is spec-first and verification-led: AGENTS.md, evals, browser smoke tests, CI gates, and a dedicated Rarebox engineering agent keep changes reviewable and controlled."
    link: /contributing/agentic-engineering
---

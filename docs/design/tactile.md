# Tactile — Design System & Branding

Tactile is Rarebox's design language, shipped with v1.4.0. This page is the
source of truth for anyone styling new features: the concept, the tokens, the
component rules, and the lines we don't cross.

## The concept

Collecting cards is physical: stickers on binders, price tags on sleeves, the
*click* of a toploader. Tactile borrows that physicality and keeps it usable.

Three ideas drive every decision:

1. **Paper and ink.** A cream page (`#faf6ef`) with near-black ink
   (`#141414`). Surfaces are white cards laid on the paper. No gradients, no
   glassy blur, no soft glows — lines are drawn, not diffused.
2. **Things press.** Interactive elements carry a hard offset shadow
   (`4px 4px 0 ink`). On `:active` the shadow compresses to `1px 1px` and the
   element translates 1px — buttons physically *click*. This is the signature
   interaction; never replace it with opacity or color-only feedback.
3. **Fun is rationed.** Stickers, rotations, and marker highlights exist —
   but only at *moments*: a portfolio total, a trade verdict, an empty state,
   a price tag on the landing page. Daily-use furniture (rows, inputs,
   tables, nav) stays calm. If everything is loud, nothing is.

## Tokens

All tokens live in `src/assets/main.css` under `:root`. **Always use tokens,
never raw hex values** — views restyle for free when tokens change.

### Surfaces & ink

| Token | Value | Use |
|---|---|---|
| `--bg-primary` | `#faf6ef` | The cream page |
| `--bg-secondary` | `#f3ede1` | Recessed wells, image backgrounds |
| `--bg-card` | `#ffffff` | Cards, panels, inputs |
| `--bg-hover` | `#f6f0e2` | Hover fills |
| `--ink` / `--border` | `#141414` | Text, borders, shadows |
| `--border-subtle` | `#e7dfd0` | Hairlines *inside* bordered panels |

### Text

| Token | Value | Use |
|---|---|---|
| `--text-primary` | `#141414` | Default text |
| `--text-secondary` | `#5f5a51` | Supporting copy, labels |
| `--text-muted` | `#99917e` | Tertiary, placeholders |

### Accents

Four fills. **Accent fills always carry ink text** (except danger and info,
which may carry white). Never use yellow/green as *text* on light surfaces —
use `text-success` (`#1e9e5a`) and `text-accent` (`#b8860b`) utilities, which
are darkened for contrast.

| Token | Value | Meaning |
|---|---|---|
| `--accent` | `#ffd23f` | Primary actions, selection, highlights |
| `--success` | `#2fbf71` | Gains, wins, completed |
| `--danger` | `#e4434f` | Losses, destructive actions |
| `--info` | `#4f86f7` | Focus rings, informational |
| `--pink` | `#ff6ba9` | Playful moments (Trade disc, CTA banners) |

Each accent has a `-dim` tint (`--accent-dim`, `--success-dim`, …) for
panel fills that need a wash of color with ink text on top.

### Geometry & shadows

| Token | Value |
|---|---|
| `--bw` (border width) | `2px` — the signature line weight |
| `--radius` | `12px` |
| `--radius-lg` | `16px` |
| `--shadow` | `4px 4px 0 var(--ink)` — feature cards, modals |
| `--shadow-sm` | `3px 3px 0` — standard panels |
| `--shadow-xs` | `2px 2px 0` — buttons, chips |
| `--shadow-pressed` | `1px 1px 0` — pressed state, small chips |

Shadows are **always hard** (no blur radius) and **always ink**. The press
pattern: `box-shadow` drops one step and the element `translate(1px, 1px)`.

## The logomark

The brand is the **RB sticker**: a yellow rounded square, 2.5px ink border,
bold uppercase **RB**, rotated −6° with a hard offset shadow — like a sticker
slapped on a binder. The wordmark is lowercase **rarebox**, weight 900,
tight letter-spacing (−0.03em).

- Mark and wordmark sit side by side in the top bar; the mark alone is the
  favicon and PWA icon (`public/favicon.svg`, `public/icon-192.svg`).
- Always uppercase **RB** in the mark. Always lowercase **rarebox** in the
  wordmark.
- Don't recolor the sticker, drop the border, or un-rotate it. On dark or
  photographic surfaces, keep the sticker as-is — it's self-contained.

## Components (from `main.css`)

These global primitives style ~70% of the app. Build with them before
writing scoped CSS:

- **`.btn`** — 2px ink border, hard shadow, press compression. Variants:
  `.btn-primary` (yellow), `.btn-secondary` (white), `.btn-danger`,
  `.btn-ghost` (transparent — for icon buttons and tertiary actions only;
  never for buttons that need to read as buttons on the cream page).
- **`.card`** — white, 2px ink border, `--shadow`. `.card-sm` for tighter
  panels, `.card-flat` to drop the shadow.
- **`.badge`** — filled chip with 1.5px ink border (`-success`, `-danger`,
  `-accent`, `-info`).
- **`.sticker`** — the rotated accent chip (−2°), with `-green`, `-pink`,
  `-blue` variants. **Maximum one rotation per screen** in the app proper.
- **`.marker`** — yellow highlighter behind a word in headings. Landing and
  empty states only.
- **`.input` / `.select` / `.textarea`** — white, 2px ink border, 44px+
  tall, 16px font on mobile (prevents iOS zoom).
- **`.modal`** — cream surface, 6px hard shadow; becomes a bottom sheet
  under 640px.
- **`.stat-tile`, `.table`, `.spinner`, `.empty-state`** — all pre-themed.

### Card scans

Physical card images always sit in a **frame**: white mat, 2px ink border,
10px radius, 4px padding (`.card-img-wrap` pattern). Never let a raw card
scan float on the page — the frame is what ties photography into the design.

## Navigation

- **< 1024px** — bottom tab bar: Home · Search · Trade · Browse · More.
  Trade is the raised pink disc in the center. Safe-area insets respected;
  fixed elements (toasts, progress pills) must clear
  `var(--tabbar-height) + env(safe-area-inset-bottom)`.
- **≥ 1024px** — slim top bar with inline nav links; active link gets the
  yellow pill with ink border. No sidebar.

## Accessibility & responsiveness (non-negotiable)

- Touch targets ≥ 44px.
- `:focus-visible` shows a 3px `--info` outline globally — don't suppress it.
- `prefers-reduced-motion` disables all transitions/animations globally.
- Ink on cream/white/yellow/green all pass WCAG AA. Re-check contrast any
  time you put text on an accent fill.
- Every screen must work from **280px** (foldable cover screens) through
  phones (360px), unfolded foldables (~717px), tablets (~834px), and
  desktop. Grids use `minmax(min(100%, Npx), 1fr)` so they can never force
  horizontal scroll.

## Voice

Copy is confident, concrete, and a little playful — "Your binder deserves
better", "Built for the pull", "Know your gains". No jargon, no hedging.
Competitors are not named in comparisons; switching is framed as easy
("bring your whole collection in one CSV").

## Do / Don't

| Do | Don't |
|---|---|
| Use tokens for every color | Hardcode hex values in views |
| Hard ink shadows | Blurred/soft shadows, glows |
| White panels on cream | Gray-on-gray surfaces |
| Ink text on accent fills | Yellow/green text on light surfaces |
| One sticker moment per screen | Rotations on everyday furniture |
| Frame card scans | Float raw card images |
| Press-compression on buttons | Opacity-only press feedback |

## Known CSS gotchas

- Scoped rules like `.root a { color: inherit }` have higher specificity
  than `.class[data-v-x]` — prefix component selectors with the root class
  when styling links-as-buttons.
- `.show-mobile` / `.hide-mobile` helpers need both the desktop base rule
  and the mobile override (see `PortfolioView.vue`).
- Full-bleed bands inside the centered container use
  `width: 100vw; margin-left: calc(50% - 50vw)` — `overflow-x: clip` on
  `html/body` guards against scrollbar-width overflow.

## Dark Tactile

Dark mode is a token remap (`:root[data-theme="dark"]` in `main.css`), not a
second design. The rules that keep it Tactile:

- **Warm coal, not black.** Paper flips to `#16140e`, surfaces to `#211e15`
  — cream's dark twin, never neutral gray or pure black.
- **Ink flips to cream** (`#f0e8d8`) for lines and text. Borders stay 2px.
- **Accent fills never change**, and text on them never flips: use
  `--on-accent` (always dark) for anything sitting on a yellow/green/pink
  fill. Text on `-dim` tints and plain surfaces uses `--ink` (flips).
- **Shadows become true black.** A light hard shadow reads as a glow, and
  Tactile never glows. Press-compression behavior is identical.
- **The marker becomes an underline** in dark — a full marker band behind
  light text would kill contrast.
- **Card photos keep white mats in both themes** — scans belong on white,
  like pages in a binder.
- Readable on-surface colored text uses `--success-text` / `--accent-text`
  (brighter in dark, darker in light) — never raw `--success`/`--accent`
  as text.
- Switching: sun/moon in the top bar, More sheet on mobile, Light/Dark/System
  in Settings. Stored in `localStorage('rarebox_theme')`, applied pre-paint.

## The Design Lab

Five complete brand directions were prototyped before Tactile won:
**Mono** (Swiss minimalism), **Aurora** (dark glassmorphism), **Tactile**,
**Atelier** (museum gallery), and **Pulse** (market terminal). All five
remain live at [rarebox.io/designs](https://rarebox.io/designs) as
standalone routes — useful as a reference for how the same product reads in
different languages, and as a starting point if a future surface (e.g. a
pro/analytics mode) wants a different voice. Full-page screenshots live in
`design-previews/` in the main repo.

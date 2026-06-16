# Static Data Pipeline

Rarebox is a **local-only app**: Vercel serves only code and static assets, and
your device makes every API call itself. There are no serverless data
endpoints — the `api/` directory contains exactly one function, `/api/og`,
which renders social-embed images for link-preview crawlers (Discord,
Telegram, X). The app never calls it.

Some data sources can't be reached from a browser, though:

1. **tcgcsv.com** (daily TCGplayer price dumps) — no CORS, and its terms of
   use allow backend scripts only
2. **Meta-deck sites** (Limitless TCG and others) — HTML scraping, no public
   API

Instead of proxying these through serverless functions, a daily GitHub
Actions workflow pre-builds them into static JSON in `public/`, which deploys
with the app like any other asset.

## The Assets

| Asset | Built by | Contents |
|-------|----------|----------|
| `public/riftbound-prices.json` | `scripts/build_riftbound_prices.py` | TCGplayer market prices for all Riftbound cards (tcgcsv category 89), keyed by TCGplayer product id, `{ normal, foil }` per product |
| `public/jp-prices.json` | `scripts/build_jp_prices.py` | TCGplayer prices for 16k+ Japanese Pokémon cards (tcgcsv category 85 "Pokemon Japan"), keyed `{tcgdex set id}-{number}` (lowercase, no leading zeros) |
| `public/meta-decks/{game}.json` | `scripts/build_meta_decks.py` | Scraped tournament meta decks per game, cards resolved to ids/images/prices |

## The Workflow

`.github/workflows/refresh-data.yml` in the app repo:

- Runs daily at **21:00 UTC** — an hour after tcgcsv's ~20:00 refresh — with a
  **23:00 retry** for days tcgcsv runs late. Also triggerable manually via
  `workflow_dispatch`.
- The price scripts compare tcgcsv's `last-updated.txt` stamp against the one
  embedded in the committed JSON and **skip the sync when nothing changed**,
  so the retry (and any manual run) is a cheap no-op.
- Both price scripts **refuse to overwrite** their output if the pull comes
  back suspiciously small — a bad upstream day degrades to stale prices,
  never broken prices. The meta-deck script likewise keeps yesterday's file
  for any game whose scraper fails.
- Changed files are committed as `github-actions[bot]`; the push to `main`
  triggers the normal Vercel static deploy. No change → no commit → no
  deploy.
- Robustness rails: a `concurrency` group (runs can't overlap), 15-minute
  job timeout, `git pull --rebase` before push (a concurrent push to `main`
  doesn't lose the refresh), and a fork guard (below).

## Running a Fork Correctly

The workflow job is gated:

```yaml
if: github.repository == 'novaoc/rarebox'
```

Forks inherit the workflow file, but their copy no-ops — otherwise every
enabled fork would hit tcgcsv and the deck sites with traffic identified as
Rarebox. **A fork still works without it**: the committed JSON ships with the
clone, just frozen at fork time.

To make your fork self-refresh:

1. **Edit the guard** in `.github/workflows/refresh-data.yml` to your
   `owner/repo`.
2. **Change the `User-Agent`** in `scripts/build_riftbound_prices.py` and
   `scripts/build_jp_prices.py` to identify *your* deployment. tcgcsv
   requires an identifying UA — generic browser UAs get a 401 — and its
   other rules (re-sync only on stamp change, ≤10k requests/day) are already
   handled by the scripts.
3. **Enable the workflow** in your fork's Actions tab. GitHub disables
   Actions in forks until you opt in, and inherited scheduled workflows stay
   disabled even after that — both are deliberate, so nothing runs by
   surprise.

Note that GitHub also auto-disables scheduled workflows in public repos
after 60 days without repository activity; the daily data commits normally
keep the timer reset on an active deployment.

## Client Consumption

The app fetches the assets same-origin (works in plain `vite dev` too —
Vite serves `public/` at the root):

- **`providers.js`** (Riftbound browse) joins `/riftbound-prices.json` on
  each card's `tcgplayer_id` — exact per-printing matches, so a Signature
  can never inherit its plain card's price. If the asset yields zero prices
  for a set (e.g. a set newer than the last refresh), it falls back to the
  old PriceCharting search.
- **`pokemonApi.js`** reads `/jp-prices.json` for Japanese card grids,
  detail views, and portfolio refresh, falling back to tcgdex's Cardmarket
  EUR data where TCGplayer has nothing.
- **`metaDecksApi.js`** fetches `/meta-decks/{game}.json` with a 24h
  localStorage cache and built-in fallback decks when the asset is missing
  or empty for a game.

## Running the Scripts Locally

```bash
pip install httpx beautifulsoup4   # meta decks only; price scripts are stdlib
python3 scripts/build_riftbound_prices.py
python3 scripts/build_jp_prices.py
python3 scripts/build_meta_decks.py [game ...]
```

Each writes into `public/` and prints what it did. The price scripts exit
early with "up to date" unless tcgcsv has refreshed since the committed
stamp.

## History

Until mid-2026 Rarebox ran Python serverless functions on Vercel
(`/api/search`, `/api/price`, `/api/sealed`, `/api/health`, `/api/meta-decks`)
for scraping and price proxying. They were removed in favor of this pipeline
— the local-only rule means the only thing a server should do is hand the
device files.

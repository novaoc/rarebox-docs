# Rarebox Data — the open TCG dataset

[rarebox-data](https://github.com/novaoc/rarebox-data) is a public, CC0
dataset of TCG catalogs and market prices — the same data Rarebox itself runs
on, published daily as plain JSON in a GitHub repo. Any application can
consume it with a `fetch()`: no API keys, no rate-limit negotiation, no SDK,
CORS-open, free forever.

**Coverage:** ~195,000 cards across Pokémon (EN + JP), Magic, Yu-Gi-Oh!,
Lorcana, One Piece (EN + JP), and Riftbound — including cards the primary
catalogs don't have: TCGplayer-only English promo sets (the `x-` sets: ME
Black Star Promos, McDonald's 2023/24, Prize Pack Series, …) and 6,450
Japanese secret rares missing from the tcgdex API. Per-card **price history
reaches back to February 2024**.

## Architecture

```
upstreams                      rarebox-data                     consumers
─────────                      ────────────                     ─────────
pokemon-tcg-data ─┐
tcgdex ───────────┤  daily   ┌─ pipelines/  (fetch+normalize) ─┐
Scryfall ─────────┼─ cron ──►│  validators/ (gate the commit)  │──► raw.githubusercontent
YGOPRODeck ───────┤  07:30Z  │  one commit per day             │──► jsDelivr CDN
Lorcast ──────────┤          └─ monthly tag: snapshot-YYYY-MM ─┘
optcgapi ─────────┤
riftcodex ────────┤          rarebox-price-history (sibling repo)
TCGplayer/tcgcsv ─┘          └─ per-card daily series since 2024-02
```

- **The git repo is the database.** Every daily refresh is one commit of
  sorted-key JSON; git's delta compression makes years of daily snapshots
  nearly free, and any historical state is reachable by ref.
- **Pipelines are deterministic Python** — one module per game, throttled to
  ≤10 req/s, isolated so one flaky upstream never blocks the rest. A failed
  day keeps yesterday's data; it never publishes a partial pull.
- **Validators gate every commit**: catalogs may not shrink >2% in a day,
  prices may not mass-move >5× (the wrong-product tripwire), `$0` is a valid
  price while `null` is forbidden, and every "this set doesn't exist
  upstream" claim carries dated evidence.
- **Hand-verified maps** (`maps/`) are published as first-class data: the
  TCGplayer↔pokemontcg join tables, the absence allowlist behind the `x-`
  sets, JP set names, and `quirks.md` — the upstream gotchas (CDN
  zero-padding, secret-rare API gaps, false abbreviation joins) that
  otherwise cost every builder the same debugging.
- **At-risk hobby APIs get raw preservation** — full upstream responses for
  optcgapi and riftcodex are stored under `raw/`, so the data outlives the
  API.

## Using it in any application

Everything lives at stable paths under
`https://raw.githubusercontent.com/novaoc/rarebox-data/main/` (or
`https://cdn.jsdelivr.net/gh/novaoc/rarebox-data@main/` for CDN caching).

### Set lists

```js
const sets = await fetch(
  'https://raw.githubusercontent.com/novaoc/rarebox-data/main/catalog/pokemon/sets.json'
).then(r => r.json())
// [{ id: 'me2', name: 'Phantasmal Flames', total: 130, printedTotal: 96,
//    releaseDate: '2025/11/14', series: 'Mega Evolution', logo: '…' }, …]
```

Games: `pokemon`, `pokemon-ja`, `mtg`, `yugioh`, `lorcana`, `one-piece`,
`riftbound`.

### Cards in a set

```js
const cards = await fetch(
  'https://raw.githubusercontent.com/novaoc/rarebox-data/main/catalog/pokemon-ja/sets/SV8.json'
).then(r => r.json())
// Every card uses the same shape across all seven games:
// { id: 'SV8-136', name: 'Pikachu ex', number: '136',
//   set: { id: 'SV8', name: 'Super Electric Breaker' },
//   rarity, supertype, image, game: 'pokemon', _lang: 'ja' }
```

`image` is always a URL to the original host — the dataset stores no image
binaries. Japanese cards carry `_lang: "ja"`; synthetic TCGplayer-only sets
use `x-` prefixed ids (`x-mep`) that can never collide with an upstream id.

### Latest prices

```js
const { stamp, prices } = await fetch(
  'https://raw.githubusercontent.com/novaoc/rarebox-data/main/prices/pokemon/latest.json'
).then(r => r.json())
prices['me2-13'] // 4.79  — key: `${setId}-${normalizedNumber}`
```

Number normalization (identical in every file): lowercase, strip the
`/total` suffix and leading zeros — `"001/217"` → `1`, `"TG07"` → `tg7`,
`"SWSH001"` → `swsh1`. **`$0` is a real market price; unknown prices are
absent, never null.**

### Price history (charts)

Per-card time series live in the sibling repo
[rarebox-price-history](https://github.com/novaoc/rarebox-price-history),
indexed by `prices/history.json` in rarebox-data:

```js
const hist = await fetch(
  'https://raw.githubusercontent.com/novaoc/rarebox-price-history/main/data/pokemon/sv8.json'
).then(r => r.json())
// hist.cards['136'].normal = [[epochDay, usd], …]  — change-points;
// multiply epochDay by 86400000 for a JS Date. Series start 2024-02-07.
```

### Time travel

Replace `main` with a monthly tag (or any commit SHA) for point-in-time
data — useful for backtesting, audits, or "what did this card cost in March":

```
…/rarebox-data/snapshot-2026-08/prices/mtg/latest.json
```

### Freshness

Each price file carries a `stamp`; `STATUS.json` at the repo root reports
per-pipeline counts and last-success times. Refresh lands daily around
07:30 UTC. Consumers should cache responses (files change at most once a
day) — raw.githubusercontent rate-limits anonymous hot-looping.

## How Rarebox uses it

Beyond being built from the same pipelines, the app treats the dataset as
its outage fallback: if pokemontcg.io or tcgdex fail (multi-hour 500s are
routine), Browse and card lookups transparently serve from the dataset
snapshot — at most a day behind, identical in shape, and *richer* where the
upstreams have holes.

## Licensing

Dataset: **CC0 1.0** — public-domain dedication, use it for anything.
Pipeline code: MIT. Card images are not part of the dataset; image URLs
point to their original hosts and remain © their respective owners.
Provenance per file: pokemon-tcg-data, tcgdex, Scryfall, YGOPRODeck,
Lorcast, optcgapi, riftcodex, and TCGplayer market data via
[tcgcsv.com](https://tcgcsv.com).

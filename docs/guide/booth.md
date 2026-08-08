# Card Booth

Selling at a card show, a store table, or out of a binder? The Booth turns your
table into something buyers can browse from their phone — before they even
reach you.

## How it works

1. **Build your booth** — Booth → New booth. Pull cards and sealed products
   straight from your shelves; each listing starts at its tracked market price
   and the asking price is yours to change. Add a venue, a date, and a note
   ("trades welcome", "prices firm").
2. **Share it** — as a **link** (socials, group chats) or a **QR** (print it,
   tape it to the table). Small booths fit in a single QR that any phone
   camera can scan — it's just a link. Bigger booths switch to an animated
   multi-frame code, scanned from inside Rarebox (Booth → Scan a booth).
   Need something tweet-sized? **Shorten for socials** turns the full link
   into a TinyURL — see the privacy note below.
   For printing or posting, **Download as picture** builds a Tactile-branded
   QR poster (booth name, venue, table total, scannable code) ready for
   socials or a table stand.
3. **Buyers browse** — opening the link shows your booth read-only: every
   listing with your price, and the full-table total. One tap on
   **Save this shop** archives it on their device, so they can check your
   table again later — even offline.

Update your booth any time; share again and the new link/QR carries the
updated listings. Old links keep showing what they carried when shared —
every share also stamps **when** it was made, so buyers see "snapshot 2h ago"
and get a nudge to re-scan at the table when a link has gone stale. For a
share that never goes stale, see [Table mode](#table-mode-run-the-booth-live)
and its live QR.

## Sealed products are real listings

Booster boxes, ETBs, decks, tins — sealed has no industry-standard
identifier, so the same box goes by a dozen names. Rarebox ships a daily
index of **8,500+ sealed products across all six games** (plus Japanese
Pokémon), keyed by TCGplayer's canonical product ids. List a box from the
search and it carries that id, which means wantlists and booth scans match
it **exactly** — "Booster Bundle (LGS)" vs "booster bundle" never matters.

## ISO wantlist — scan a table, know instantly

The good stuff often isn't on display: binders are too risky to leave out,
and $1–50 cards aren't practical to spread on a table. The wantlist fixes
the "is anything I need here?" problem without anyone pawing through
binders:

- **Build your list** under Booth → My wantlist: search any card or sealed
  product, set a quantity and an optional max price. Hunting a master set?
  The set gallery's **🎯 ISO the rest** button turns every card you're
  missing into wants in one tap.
- **Scan any booth** (or open any booth link) and matches light up
  immediately — a 🎯 banner with the count, **ON YOUR LIST** stickers on the
  matching listings, and a "show matches only" toggle. This works on the
  seller's *entire* inventory, including what's in the case under the table.
- **Saved shops show 🎯 badges** with how many of your wants each table has,
  so after a lap of the hall you know exactly where to go back to.

Matching is exact on card/product identity when both sides picked from the
database, with a word-matching fallback for hand-typed listings.

### Demand flags — know what other vendors want (v1.5)

Booth shares now carry the owner's wantlist inside the share itself. Scan
another vendor's booth and save it, and **your own table mode flags any of
your listings that vendor is hunting** — a "🎯 ISO — *shop name*" chip right
on the row. Walk the hall once, come back knowing exactly which of your
cards the table across the aisle wants to trade for. (Shares are still
fully self-contained and serverless; re-sharing a scanned booth keeps its
original wantlist, never yours.)

## Table mode — run the booth live

Five deals back-to-back and the list is already out of date — that's the
moment Table mode (Booth → 🔥 Table) is built for. It's a full-screen,
one-thumb view of your own booth:

- **💵 Sold / 🔁 Trade** buttons on every row: quantity drops (the listing
  disappears at zero), with an **Undo** toast that reverses whole deals.
- **Trades record both sides.** The Trade sheet asks what came in: search
  any card or sealed product, set the agreed value, and tick "list it" to
  put it straight on the table — plus cash on top in either direction.
  "A 151 booster box + $20 for an OP-05 box" is one logged deal.
- **Buy mode** in the + Add search: flip the toggle, enter what you paid,
  and the cost comes off your table cash. Net cash **can go negative** —
  buying hard mid-show is normal dealering, and the ledger says so plainly.
- The **ledger** drives live recap chips (net cash, trades, buys) and a
  day log. **📊 Export Excel** turns any booth into a workbook: Summary
  (all-time and today — sales, buys, trades in/out, net cash), Ledger
  (every movement, timestamped, trades grouped), and current Listings.
  No photos to reconstruct from, no spreadsheet at midnight.

### The live QR

Printed QRs are snapshots — accurate the moment you print them, fiction by
mid-afternoon. Table mode's **📺 Live QR** is the fix: a full-screen code
that **re-encodes itself every time your inventory changes**, with the
screen kept awake. Prop a phone or tablet on a stand facing the aisle, and
every buyer who scans gets the booth as it exists *right now* — mark a card
sold and the code on the stand is already correct.

### Run it from your phone (remote display)

Better still: put the QR on one device and the controls on another.
Inside the Live QR screen, **📡 Show on another device** makes a pairing
code — scan it with a tablet's camera (or open the link there) and that
screen becomes the booth display. Every sale, trade, and price change you
make on your phone re-encodes the tablet's QR within seconds.

How it travels, honestly: updates go through [ntfy.sh](https://ntfy.sh),
a free public relay, **end-to-end encrypted** — the key is born inside
the pairing code and never leaves your two devices, so the relay only
ever carries scrambled bytes on a random channel. Same trade-off family
as short links, disclosed the same way. If the venue network is hostile,
put the tablet on your phone's hotspot and everything still works.

## Booth branding

Give your table an identity buyers remember: pick an **accent color** and a
**monogram** (an emoji or your initials) in the booth editor — they ride
inside the share itself, cost a few bytes, and work offline. Buyers see
your colors as a header strip and chip on the booth page, and the QR poster
paints its name sticker in your color too. Have a hosted logo? Paste an
`https://` image link and it shows in place of the monogram.

## Built for visitors

Buyers don't need Rarebox, and a shared booth never pressures them into it:

- **No popups.** Booth pages never show the card-database picker or
  download-progress indicators — someone scanning five booths at a show
  sees five booths, nothing else.
- **One small invite.** First-time visitors get a single dismissible banner
  above the booth ("made with Rarebox — track your own collection free").
  Dismiss it once and it never returns.
- **Uniform listings.** Card scans, booster boxes, and tins all frame into
  the same white mat regardless of image shape, so a booth reads as one
  tidy table.
- **Sortable.** Any booth you open sorts by price (or the seller's order),
  so the bargain hunt takes two taps.

## No servers, by design

Rarebox doesn't host anything, so there is nothing to upload a booth *to* —
and that's the feature. The entire booth travels **inside the share artifact
itself**: the URL fragment (`/booth#b=…`) carries the compressed booth data,
and browsers never send fragments to any server. The QR encodes the same
bytes. Seller to buyer, device to device, nobody in between. The wantlist
and day journal live on your device too — and ride along in backups and
device transfers like everything else.

Practical sizes: listings compress to roughly 25–60 bytes each. Up to ~60–100
listings fit in a single camera-scannable QR; beyond that the animated code
takes over and links keep working into the hundreds of listings (some chat
apps truncate very long URLs — if a link misbehaves, the QR always works).

### Short links

**Shorten for socials** (in the share dialog) trades a little purity for a
lot of convenience: it asks TinyURL to wrap your full link, straight from
your device — the request never passes through Rarebox. Two things to know:

- The short link (and therefore your booth's contents) is **stored in
  TinyURL's database**. Booths are meant to be public, but it's the one
  share path where a third party holds a copy.
- Opening a short link **requires internet** (it's a redirect). The QR and
  the full link stay self-contained and work offline once saved.

## Saved shops

Booths other collectors share with you live under **Booth → Saved shops** —
a browsable archive like your set lists. Open them any time. The cross-shop
search digs through every saved booth at once, with **game and max-price
filters** — "every Pokémon card under $20 at every table" needs no search
text at all. Saved shops are included in your backups and device transfers,
and wiped by Reset Everything like everything else.

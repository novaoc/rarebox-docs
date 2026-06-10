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
3. **Buyers browse** — opening the link shows your booth read-only: every
   listing with your price, and the full-table total. One tap on
   **Save this shop** archives it on their device, so they can check your
   table again later — even offline.

Update your booth any time; share again and the new link/QR carries the
updated listings. Old links keep showing what they carried when shared —
which also means a shared booth is a snapshot, not a live feed.

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

## No servers, by design

Rarebox doesn't host anything, so there is nothing to upload a booth *to* —
and that's the feature. The entire booth travels **inside the share artifact
itself**: the URL fragment (`/booth#b=…`) carries the compressed booth data,
and browsers never send fragments to any server. The QR encodes the same
bytes. Seller to buyer, device to device, nobody in between.

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
a browsable archive like your set lists. Open them any time. They're included
in your backups and device transfers, and wiped by Reset Everything like
everything else.

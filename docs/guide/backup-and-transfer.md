# Backup & Transfer

Since Rarebox stores all data locally in your browser, backups are important. The app provides several ways to export, backup, and transfer your collection.

## Excel Export

Export any portfolio to an Excel (.xlsx) file with two sheets:

- **Summary** — portfolio name, total value, cost basis, gain/loss
- **Items** — every item with name, type, set, quantity, cost basis, current price, gain/loss

You can also export **all portfolios** into a single Excel file, with one sheet per portfolio plus a combined summary sheet.

## JSON Backup

The full backup exports your entire collection as a JSON file — all portfolios, items, settings, snapshots, and deck data. This is the most complete backup method.

### Restore

Import a JSON backup on any device to restore your collection exactly as it was. This is useful for:

- Moving to a new computer or browser
- Recovering after clearing browser data
- Keeping an offline backup

## Device Transfer

Need to move your collection from your laptop to your phone (or vice versa)?

### QR Code Transfer
Rarebox compresses your collection data with gzip and encodes it as a QR code. Scan the code on the target device to import everything. This works well for smaller collections.

### Clipboard Transfer
For larger collections that exceed QR code capacity, use clipboard copy/paste. Copy the compressed data string on one device, paste it on the other.

## Collectr Import

Migrating from Collectr? Rarebox can import your Collectr CSV or XLSX export directly:

1. Go to **Settings → Import from Collectr**
2. Upload your CSV or XLSX file
3. Rarebox parses card names, sets, quantities, conditions, grading info, and cost data
4. Japanese cards, graded slabs, and sealed products are all handled automatically
5. Game type is auto-detected from card names and set codes

### What Gets Imported

- Card names and set codes
- Quantities and purchase prices
- Grading company and grade (PSA, BGS, CGC)
- Condition (Near Mint, Lightly Played, etc.)
- Japanese card detection
- Variant normalization (1st Edition, Reverse Holo, etc.)

## Data Integrity

- Stale data cleanup runs automatically — deleted cards don't linger in snapshots or backups
- JSON backups include schema version information for forward compatibility
- Restoring a backup replaces all current data — export first if you want to preserve both

::: tip
Get into the habit of downloading a JSON backup periodically. IndexedDB data is durable but not invincible — a browser reset or OS reinstall will clear it.
:::

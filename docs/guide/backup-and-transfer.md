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

## Data Integrity

- Stale data cleanup runs automatically — deleted cards don't linger in snapshots or backups
- JSON backups include schema version information for forward compatibility
- Restoring a backup replaces all current data — export first if you want to preserve both

::: tip
Get into the habit of downloading a JSON backup periodically. IndexedDB data is durable but not invincible — a browser reset or OS reinstall will clear it.
:::

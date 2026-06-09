# Serverless Functions

Rarebox is primarily a client-side app, but a few operations need server-side execution. These run as **Vercel Functions** — Python serverless functions in the `api/` directory.

## Why Server-Side?

Three reasons a request needs to go through the server:

1. **CORS restrictions** — some APIs don't allow browser-origin requests
2. **HTML scraping** — Limitless TCG doesn't have a public API; we scrape their site
3. **Response transformation** — some data needs processing before the client can use it (e.g., resolving card set codes to pokemontcg.io IDs)

Everything else is fetched directly from the browser.

## Endpoints

### `GET /api/health`

Simple health check. Returns 200 with a status message. Used for uptime monitoring.

### `GET /api/search`

Scrapes Limitless TCG for current meta deck data. This is the most complex endpoint:

1. Fetches the meta standings page from Limitless
2. Parses HTML with BeautifulSoup to extract top decks, meta share, and CP
3. Resolves core card names to exact pokemontcg.io card IDs (set code + card number)
4. Returns structured JSON with deck names, card lists, and metadata

**Performance:** Can take 5-15 seconds depending on Limitless response time and the number of card resolutions needed. Max duration is 30 seconds (configured in `vercel.json`).

### `GET /api/price`

Price proxy/lookup endpoint. Fetches and transforms price data that can't be accessed directly from the browser.

### `GET /api/sealed`

Fetches sealed product pricing from PriceCharting for items that need server-side access.

## Client-Side Meta Decks

In addition to the serverless endpoint, `metaDecksApi.js` provides:

- **Live fetch** from `/api/search` with localStorage fallback (24h cache)
- **Static fallback decks** when the live endpoint is unavailable
- **Game-specific caching** — each TCG has its own cache key
- **Cache invalidation** — stale fallback data is removed when server data is available

## Runtime Configuration

From `vercel.json`:

```json
{
  "functions": {
    "api/**/*.py": {
      "runtime": "@vercel/python@4.5.0",
      "maxDuration": 30
    }
  }
}
```

- **Runtime:** Python via `@vercel/python@4.5.0`
- **Max duration:** 30 seconds per invocation
- **Dependencies:** `httpx` (async HTTP) and `beautifulsoup4` (HTML parsing), specified in `requirements.txt`

## Developing Locally

Vercel Functions can be tested locally using the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

This starts a local dev server that emulates the serverless function runtime. API endpoints are available at `http://localhost:3000/api/*`.

## Caching Recommendations

Currently, API responses aren't cached server-side. For production traffic, consider:

- **Quick win:** Add `Cache-Control: s-maxage=3600` headers to responses. Vercel's CDN caches them automatically for the specified duration.
- **Meta decks:** Could use `s-maxage=86400` (24h) since tournament data changes daily at most.
- **Price lookups:** `s-maxage=3600` (1h) is a reasonable default.

```python
# Example: adding cache headers to a response
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # ... fetch and process data ...
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Cache-Control', 's-maxage=3600')
        self.end_headers()
        self.wfile.write(json.dumps(result).encode())
```

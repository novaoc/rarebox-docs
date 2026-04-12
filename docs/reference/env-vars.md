# Environment Variables

Rarebox is designed to work without any configuration. All environment variables are optional.

## Frontend (Vite)

Variables prefixed with `VITE_` are available in client-side code via `import.meta.env`.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_POKEMONTCG_API_KEY` | No | None | pokemontcg.io API key for higher rate limits. Without a key, you get 20,000 requests/day — enough for most use cases. |

<!-- TODO: Nova — add any other VITE_ env vars used in the codebase -->

## Serverless Functions (Python)

Environment variables available to the Python functions in `api/`.

<!-- TODO: Nova — document any env vars used by the Python functions, if any -->

Currently, the serverless functions don't require any environment variables. They make unauthenticated requests to public APIs.

## Vercel

These are configured in the Vercel project settings, not in code:

| Variable | Purpose |
|----------|---------|
| `VERCEL_ANALYTICS_ID` | Auto-configured by Vercel when analytics is enabled |

## `.env.example`

Create a `.env` file in the project root for local development:

```bash
# Optional: pokemontcg.io API key for higher rate limits
# Get one at https://pokemontcg.io
# VITE_POKEMONTCG_API_KEY=your-key-here
```

::: tip
Copy `.env.example` to `.env` and uncomment any variables you need. The `.env` file is gitignored and should never be committed.
:::

# Development Setup

Get Rarebox running locally for development.

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Git**

## Clone & Install

```bash
git clone https://github.com/novaoc/rarebox.git
cd rarebox
npm install
```

## Start Dev Server

```bash
npm run dev
```

Opens at `http://localhost:5173`. Vite provides instant HMR — changes to Vue components, CSS, and JS reflect immediately.

## Test Serverless Functions Locally

The Python serverless functions in `api/` can be tested with the Vercel CLI:

```bash
npm i -g vercel
vercel dev
```

This starts a combined dev server: Vite handles the frontend, Vercel CLI emulates the serverless function runtime. API endpoints are available at `/api/*`.

### Python Dependencies

The serverless functions require Python 3.9+ with:

```bash
pip install httpx beautifulsoup4
```

These are specified in `requirements.txt` and installed automatically by Vercel during deployment.

## Environment Variables

<!-- TODO: Nova — document any env vars needed for local development -->

Create a `.env` file in the project root if needed:

```bash
# Optional: pokemontcg.io API key for higher rate limits (20k/day without, more with)
# VITE_POKEMONTCG_API_KEY=your-key-here
```

::: tip
You don't need an API key to develop locally. The default rate limit (20,000 requests/day) is more than enough for development.
:::

## Build for Production

```bash
npm run build
```

Outputs to `dist/`. Preview the production build locally:

```bash
npm run preview
```

## Project Structure

See [Project Structure](/architecture/project-structure) for a full walkthrough of the codebase.

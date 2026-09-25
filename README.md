# Proowrx

A single Next.js 16 application for the marketing website, dashboard and API.

## Run locally

1. Run `npm install` from this directory.
2. Copy `.env.example` to `.env.local` for a fresh setup and supply MongoDB, JWT, Cloudinary and email settings. Existing local environment files were preserved during consolidation.
3. Run `npm run dev` and open http://localhost:3000. The dashboard is at `/dashboard`.

Use `npm run build` then `npm start` for production. No separate backend process, port 5000, CORS configuration or public API URL is needed. Browser requests use `/api`; Server Components query MongoDB directly.

## Project layout

- `app/` — App Router pages, layouts, metadata, sitemap and legacy upload delivery.
- `pages/api/[...path].js` — Next.js API entry point. Existing Express routers run inside this function to preserve authentication, multipart uploads and endpoint compatibility; there is no Express listener.
- `server/` — database connection, models, API routers, middleware, integrations and maintenance scripts.
- `components/` — shared site components.
- `features/` — dashboard panels and analytics.
- `lib/` — browser API transport, server queries and metadata helpers.
- `data/pages.json` — shared registry of static pages and insight destinations.
- `public/`, `styles/` — public assets and shared styles.
- `tests/` — isolated content and API tests (`npm test`). These never modify the configured database.

## Insights and SEO

In the blog/insight editor, use **Show this insight on** to search and select multiple home or service pages. Published posts and scheduled posts whose publish time has arrived appear in those pages' insights sections. Draft and paused posts do not appear. Existing posts default to no placements. Sections hide when no published insights are assigned.

All existing service routes are supported, including Bookkeeping, Dedicated Resource / Virtual Assistant and Pay Per Application. Sub-services that currently share a parent URL are searchable aliases of that page, not invented standalone pages.

Use **Page SEO** in the dashboard for static pages. Individual blog/insight SEO is in the post editor. Fields include title, description, primary/secondary keywords, canonical URL, social metadata and indexing/follow controls. Empty fields retain existing defaults. Metadata is rendered on the server on the next request; no rebuild is required. Noindex pages/posts are omitted from the sitemap.

The single package lockfile covers the entire application. The database collections and existing content do not need migration. Legacy local assets are preserved in `server/uploads`; new uploads continue to use Cloudinary.

## Deployment notes

For standalone deployment, copy `public` and `.next/static` alongside `.next/standalone` as required by Next.js. Preserve `server/uploads` if using legacy local files. Configure `TRUST_PROXY` only for your deployment's trusted reverse proxy addresses.

The existing resource-download OTP/token maps and API rate limits are in process memory. A multi-instance/serverless deployment needs shared storage for these existing features. Use a persistent Node instance until that storage is introduced.

Maintenance scripts in `server/scripts` use the root environment and default to http://localhost:3000/api. They are retained because they perform content imports and migrations, not runtime duplication.

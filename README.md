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

## Insights and SEO

In the blog editor, use **Show this insight on** to search and select multiple service pages. Published posts and scheduled posts whose publish time has arrived appear in those pages' insight sections. Draft and paused posts do not appear. The home page always shows the three latest published blogs in its **Insights** section immediately before the CTA.

Case studies have a separate dashboard section and story format: client, industry, service, challenge, approach, results, measurable outcomes, testimonial, placements and SEO. Published case studies can be assigned to Home and service pages independently of blogs.

All existing service routes are supported, including Bookkeeping, Dedicated Resource / Virtual Assistant and Pay Per Application. Sub-services that currently share a parent URL are searchable aliases of that page, not invented standalone pages.

Use **Page SEO** in the dashboard for static pages. Individual blog/insight SEO is in the post editor. Fields include title, description, primary/secondary keywords, canonical URL, social metadata and indexing/follow controls. Empty fields retain existing defaults. Metadata is rendered on the server on the next request; no rebuild is required. Noindex pages/posts are omitted from the sitemap.

Dashboard image fields upload from the computer through the authenticated media endpoint. Replacing or deleting a blog, case study, resource, team-member, author, work-life or SEO image also removes its superseded Cloudinary asset after the database change succeeds. Team-member photos are also used for selected blog authors. Downloadables require a title, description, cover image, file and SEO settings. Visitors provide their name, email and contact number before receiving a ten-minute download link; the request is saved under Form Enquiries with its downloadable and source page.

Analytics supports Today, Yesterday, Last 7 days, This month, Last 30 days, Last 90 days and inclusive custom dates. Reports can be filtered to one page and show traffic sources, visitors, sessions, devices, browsers and the page's saved SEO configuration. Google Search impressions, clicks, rankings and indexing status require a separate Search Console integration.

The single package lockfile covers the entire application. The database collections and existing content do not need migration. Legacy local assets are preserved in `server/uploads`; new uploads continue to use Cloudinary.

## Deployment notes

Copy `.env.example` to `.env.production`, replace every placeholder, and keep that file outside source control. `JWT_SECRET` must be at least 32 characters and the bootstrap `ADMIN_PASSWORD` at least 14 characters in production. The application no longer creates an account from hardcoded credentials.

Vercel continues to provide the proxy and TLS layer for the current deployment; it ignores the repository's Docker and Nginx configuration. For a future self-hosted server, follow [deploy/README.md](deploy/README.md). The included setup provisions the standalone Next.js container, Nginx reverse proxy and Let's Encrypt certificate, then enables HTTPS redirects, connection/request limits, compression and immutable asset caching.

For a manual standalone deployment, copy `public` and `.next/static` alongside `.next/standalone` as required by Next.js. Preserve `server/uploads` if using legacy local files. Set `TRUST_PROXY=1` only when the application receives traffic through exactly one trusted reverse proxy; otherwise it trusts loopback proxies only.

Download links are signed, resource-scoped and expire after ten minutes, so they do not require shared in-memory state. API rate limits remain process-local; use a shared rate-limit store for multi-instance deployment.

Maintenance scripts in `server/scripts` use the root environment and default to http://localhost:3000/api. They are retained because they perform content imports and migrations, not runtime duplication.

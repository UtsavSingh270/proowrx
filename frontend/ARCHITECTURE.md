# Frontend architecture

This project uses Next.js App Router with route colocation. Page-specific components and styles stay inside their route directory; reusable code is promoted only when it serves multiple routes or a complete feature.

## Directories

- `app/` — routes, layouts, loading/error boundaries, metadata, and route-specific UI.
- `components/layout/` — site-wide navigation, footer, and layout overlays.
- `components/feedback/` — interactive feedback surfaces such as chat and cookie consent.
- `components/providers/` — global React providers and client-side application effects.
- `components/shared/` — reusable, domain-neutral UI used by multiple routes.
- `features/` — cohesive business capabilities with their own components and behavior.
- `data/` — static application data and local knowledge bases.
- `lib/` — framework-independent utilities and server-side API helpers.
- `services/` — browser-facing API service definitions.
- `styles/` — global theme and application styles.
- `public/` — static assets served from the site root.

## Conventions

- Use `@/` imports for cross-directory dependencies.
- Use relative imports only for files colocated in the same route or component folder.
- Keep one-off page sections in their route instead of creating small components.
- Add a shared component only when it is reused or represents a complete interaction.
- Keep client components as low in the tree as practical; route files remain server components by default.
- Keep component-specific CSS beside its component and global tokens in `styles/`.

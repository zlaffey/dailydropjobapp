# DealDrop

DealDrop is a frontend portfolio prototype for a Daily Drop-style product: points deal search, subscriber dashboard, saved deals, settings, paywall gating, and a live A/B experiment on default sort order.

## Tech Stack

- Next.js App Router
- React 19
- TypeScript (for domain/services/components)
- Tailwind CSS v4
- Vitest + Testing Library

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Quality Gates

```bash
npm run lint
npm run test:run
npm run build -- --webpack
```

Note: In this environment, `next build` with Turbopack may fail due sandbox process restrictions, so webpack mode is used for CI verification.

## Architecture

- `app/page.js`: app assembly with dashboard/search/saved/settings tabs.
- `src/types`: core domain model (`Deal`, `SearchState`, `UserSettings`, etc.).
- `src/data`: deterministic mock dataset (`60` deals).
- `src/services`: cached search/recommendation/trending service layer.
- `src/hooks`: URL sync, debounced search orchestration, localStorage state hooks.
- `src/components`: modular UI by domain (`deals`, `search`, `dashboard`, `saved`, `settings`, `subscriber`, `layout`, `ui`).
- `src/contexts/AppContext.tsx`: cross-tab app state composition.

## How This Maps to Daily Drop

| Daily Drop Focus | DealDrop Implementation |
| --- | --- |
| Deal discovery/search interfaces | Live filtering, scoring, sorting, cache status bar, URL-restorable query state |
| Cached search UX | In-memory + localStorage cache with TTL, cache hit tracking, explicit refresh |
| Subscriber experience | Personalized dashboard, saved deals, recently viewed, travel goal tracking |
| Conversion + paywall UX | Free-tier blur gate after 5 results, upgrade banner, pricing toggle |
| Experimentation and analytics | Variant assignment (`best_value` vs `lowest_points`), structured event tracking |
| Frontend craft | Componentized architecture, responsive layout, keyboard interactions, tests |

## Current Scope

Implemented across seven phases from `plan.md`:

- Foundation: data model/constants/services/testing setup
- Deal cards + detail drawer
- Search hooks + filters + cache UX
- Dashboard personalization/state management
- Saved deals + settings workflows
- Paywall + upgrade flow + experiment metadata
- App shell extraction, tab hash persistence, README mapping

# GoldenSeafood Frontend Agent Instructions

This file guides AI coding agents working in `Frontend/`.

## Run Commands (Frontend)

- Install: `npm install`
- Dev: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview: `npm run preview`

Run all commands from `Frontend/` (not workspace root).

## Tech Stack

- React 19 + Vite
- Material UI + SCSS Module
- React Router
- Redux Toolkit
- Axios
- React Hook Form + Yup

## Architecture Boundaries

- `src/pages/`: page-level screens only.
- `src/components/`: reusable UI components.
- `src/services/`: API calls grouped by domain.
- `src/api/axios.js`: shared axios client and base URL handling.
- `src/redux/`: global state slices and store wiring.
- `src/layouts/`, `src/routes/`: app shell and routing.

Do not call APIs directly in page/component files when a service layer should be used.

## Project Rules

- Do not use Tailwind or Bootstrap.
- Use Material UI and SCSS Module only.
- Keep components reusable.
- Build responsive layout from Desktop -> Tablet -> Mobile.
- Do not hard-code API URLs.
- Keep each page under its own folder in `src/pages/`.

## Integration Notes (Important)

- Frontend should use `VITE_API_BASE_URL` via `src/api/axios.js`.
- Product category filtering contract can drift:
    - Backend service currently filters by `category` (slug), not `category_id`.
    - Verify query parameter compatibility before changing product filters.
- When updating API contracts, align both docs:
    - `Frontend/docs/FRONTEND_INTEGRATION_PLAN.md`
    - `Backend/FRONTEND_INTEGRATION_PLAN.md`

## Source Of Truth Docs

- Frontend integration: `Frontend/docs/FRONTEND_INTEGRATION_PLAN.md`
- Content copy: `Frontend/docs/WebsiteContent.md`
- Backend API overview: `Backend/README.md`

## Validation Checklist

After code changes in `Frontend/`:

1. Run `npm run lint`.
2. Run `npm run build`.
3. If API-facing changes were made, confirm service calls in `src/services/` still match backend routes.
# Surf Share Frontend

Production-ready frontend starter built with Next.js 16 App Router.

## Tech stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- React Query (`@tanstack/react-query`)
- Axios
- React Hook Form + Zod
- Class utilities: `clsx`, `tailwind-merge`, `class-variance-authority`
- Sonner toasts
- Next Themes

## Project structure

```txt
app/
	error.tsx
	global-error.tsx
	loading.tsx
	not-found.tsx
	providers.tsx
	robots.ts
	sitemap.ts
components/
	layout/
	shared/
	ui/
config/
	site.ts
lib/
	api/
	query/
	env.ts
	utils.ts
types/
```

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Copy environment template and update values as needed:

```bash
cp .env.example .env.local
```

3. Run development server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Scripts

- `npm run dev`: start local development server
- `npm run build`: create production build
- `npm run start`: run built app
- `npm run lint`: run ESLint
- `npm run lint:fix`: auto-fix ESLint issues
- `npm run typecheck`: run TypeScript checks
- `npm run format`: format code with Prettier
- `npm run format:check`: check formatting in CI

## Frontend workflow baseline

- Keep reusable UI primitives in `components/ui`.
- Keep layout-level building blocks in `components/layout`.
- Keep app-wide config/constants in `config`.
- Use `lib/api/client.ts` for backend API integration when backend is ready.
- Use React Query for async server state and caching.

## Production readiness included

- Route-level error boundary (`app/error.tsx`)
- Global error fallback (`app/global-error.tsx`)
- Loading and not-found pages
- Metadata, robots, and sitemap defaults
- Lint/typecheck/format scripts for CI

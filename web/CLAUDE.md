# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun --bun run dev       # Start dev server on port 3000
bun --bun run build     # Production build
bun --bun run test      # Run tests (vitest)
bun --bun run lint      # Lint with eslint
bun --bun run format    # Format and auto-fix (prettier + eslint --fix)
bun --bun run check     # Check formatting only
```

Add shadcn components:

```bash
pnpm dlx shadcn@latest add <component>
```

## Agent Workflow

**ALWAYS** route every user request through the `task-orchestrator` agent before taking any action. Do not directly implement, research, or respond to task requests yourself — delegate to the orchestrator, which will interpret intent and dispatch to the appropriate specialist agent.

## Architecture

**Framework**: TanStack Start (SSR-enabled React framework built on Vite and TanStack Router).

**Routing**: File-based via `src/routes/`. TanStack Router auto-generates `src/routeTree.gen.ts` — never edit this file manually. The root layout is `src/routes/__root.tsx`, which uses `shellComponent` (not a `component`) to wrap the full HTML document.

**Router + Query integration**: `src/router.tsx` wires TanStack Query into the router context via `setupRouterSsrQueryIntegration`, enabling SSR-aware data fetching. The `QueryClient` is created in `src/integrations/tanstack-query/root-provider.tsx` and passed as router context so loaders can use it.

**Path aliases**: `#/*` maps to `src/*` (configured in `package.json` `imports` and resolved via `tsconfig` paths). Use `#/components`, `#/lib`, `#/hooks`, etc. — never use relative `../../` imports.

**UI components**: shadcn/ui with the "new-york" style, zinc base color, CSS variables, and lucide icons. Components live in `src/components/ui/`. The `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) is the standard way to compose class names.

**Styling**: Tailwind CSS v4 via the Vite plugin (`@tailwindcss/vite`). Global styles in `src/styles.css`.

**State management**: TanStack Store (`@tanstack/react-store`) for client-side state; TanStack Query for server state.

**Forms**: TanStack Form (`@tanstack/react-form`) with Zod for validation.

**Devtools**: TanStack Devtools panel is mounted in `__root.tsx` in development and includes Router and Query devtools — do not remove.

**Server functions**: Use `createServerFn` from `@tanstack/react-start` for server-only logic (auth, cookie access, backend API calls). The `tanstackStart()` Vite plugin handles the server/client split automatically — **never add `'use server'` to files using `createServerFn`**, it conflicts with the split mechanism and causes server function handlers to hang. Use `.inputValidator(zodSchema)` (not `.validator()`) to attach input validation. Server-only utilities (`getCookie`, `setCookie`, `deleteCookie`) come from `@tanstack/react-start/server`.

**Authentication**: JWT stored in an httpOnly cookie (`auth_token`). Session server functions live in `src/lib/auth.ts`. Protected routes sit under the `_authenticated` pathless layout (`src/routes/_authenticated.tsx`), which redirects unauthenticated users to `/auth/sign-in`. The root `beforeLoad` in `__root.tsx` calls `getSessionFn()` to populate `user` into router context on every navigation.

**Backend services** (separate .NET processes, not part of this repo):

- Auth service: `http://localhost:5200` — `POST /auth/login`, `POST /auth/register`, `POST /auth/verify-email`, `POST /auth/resend-confirmation`
- Expenses API: `http://localhost:5100` — `/expenses` endpoints, all require `Authorization: Bearer <token>`
- URLs configured via `.env` (`AUTH_API_URL`, `PENNIES_API_URL`)

**Component architecture**: Every screen has a mobile and a desktop variant. Components live in `src/components/pennies/mobile/` and `src/components/pennies/desktop/`. Routes render both, toggling visibility with `md:hidden` / `hidden md:block`. Never combine mobile and desktop logic into a single component.

**Domain library** (`src/lib/pennies.ts`): Core utilities for the expense domain — `formatVnd` (VND display), `formatVndShort` (compact axis labels: `₫1,7M` / `₫705k`), `periodSummary` (today/week/month/year totals), `catBreakdown` (category rollup with emoji + dot color), `monthSeries` (last N months for bar charts), and date helpers (`getPrevMonth`, `monthLabel`, `monthShort`, etc.). Always import from here rather than computing inline.

**i18n**: `react-i18next` with locale files at `src/lib/locales/en.ts` (source of truth) and `vi.ts`. `vi.ts` is typed against `en.ts` so adding a key to `en.ts` without adding it to `vi.ts` is a compile error. Use `useTranslation()` in all user-visible strings.

**Categories**: `src/lib/categories.ts` exports `categoryColor(id)` → `{ dot, ink }` (pastel fill + text color). Category metadata (name, icon) comes from the API via `useCategories()` hook (`src/hooks/useCategories.ts`).

**Design source**: The Pennies design project lives at `https://claude.ai/design/p/019e2493-c653-7b67-9d8f-1d6a13fcafe2`. Use the `DesignSync` MCP tool (available after `/design-login`) to read design files and sync implementations.

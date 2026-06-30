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

**Router + Query integration**: `src/router.tsx` wires TanStack Query into the router context via `setupRouterSsrQueryIntegration`, enabling SSR-aware data fetching. The `QueryClient` is created in `src/integrations/tanstack-query/root-provider.tsx` and passed as router context so loaders can use it. Router context shape: `{ queryClient: QueryClient; user: SessionUser | null }`.

**Path aliases**: `#/*` and `@/*` both map to `src/*` (declared in `tsconfig.json` paths and `package.json` imports). Prefer `#/` as the canonical form. Never use relative `../../` imports.

**UI components**: shadcn/ui with the "new-york" style, zinc base color, CSS variables, and lucide icons. Components live in `src/components/ui/`. The `cn()` utility from `src/lib/utils.ts` (clsx + tailwind-merge) is the standard way to compose class names.

**Styling**: Tailwind CSS v4 via the Vite plugin (`@tailwindcss/vite`). Global styles in `src/styles.css`.

**State management**: TanStack Store (`@tanstack/react-store`) for client-side state; TanStack Query for server state.

**Theme**: `src/lib/themeStore.ts` manages light/dark/system theme via a TanStack `Store<{ theme: Theme }>`. `setTheme(t)` persists to `localStorage` and a `theme` cookie; `useTheme()` is the reactive hook. `themeInitScript` is an inline `<script>` injected into `<head>` before React hydrates to prevent flash-of-wrong-theme. `ThemePicker` (`src/components/pennies/ThemePicker.tsx`) is the UI control.

**Forms**: Native HTML `<form>` elements with `onSubmit` + `e.preventDefault()`. Always wrap submission logic in `<form>` so Enter-key submission works; do not attach it only to a button click. Zod is used for server-function input validation (`.inputValidator(zodSchema)`) but not for form-level validation.

**Devtools**: TanStack Devtools panel is mounted in `__root.tsx` in development and includes Router and Query devtools — do not remove.

**Server functions**: Use `createServerFn` from `@tanstack/react-start` for server-only logic (auth, cookie access, backend API calls). The `tanstackStart()` Vite plugin handles the server/client split automatically — **never add `'use server'` to files using `createServerFn`**, it conflicts with the split mechanism and causes server function handlers to hang. Use `.inputValidator(zodSchema)` (not `.validator()`) to attach input validation. Server-only utilities (`getCookie`, `setCookie`, `deleteCookie`) come from `@tanstack/react-start/server`.

**Authentication**: JWTs stored in two httpOnly cookies — `auth_token` (1 h access token) and `refresh_token` (30-day). `getSessionFn()` in `src/lib/auth.ts` decodes the access token or silently calls `/auth/refresh-token`; a failed refresh clears both cookies and returns `null`. Protected routes sit under the `_authenticated` pathless layout (`src/routes/_authenticated.tsx`), which redirects unauthenticated users to `/auth/sign-in`. The root `beforeLoad` in `__root.tsx` calls `getSessionFn()`, `getLocaleFn()`, and `getThemeFn()` in parallel to populate `user`, locale, and theme into router context on every navigation. The `SessionUser` type (`{ sub, email, displayName }`) is exported from `src/lib/auth.ts`. Full auth routes live under `src/routes/auth/` — sign-in, sign-up, verify-email, check-email, verified, verify (token link), forgot-password, reset-password, and `o-auth/google` (Google OAuth callback).

**Backend service** (single .NET process, not part of this repo): configured via `.env` (`API_URL=http://localhost:9999`, `APP_URL=http://localhost:3000`). The `API_URL` constant is exported from `src/lib/constants.ts` and used inside server functions — never import `process.env` directly in components.

- Auth endpoints (all under `/auth`): `login`, `logout`, `register`, `verify-email`, `resend-confirmation`, `refresh-token`, `google/url`, `google/login`, `forgot-password`, `reset-password`, `profile`, `profile/display-name`, `request-email-update`, `confirm-email-update`, `change-password`.
- Expenses endpoints (all under `/expenses`, require `Authorization: Bearer <token>`): CRUD at `/expenses` and `/expenses/:id`; plus `/expenses/categories` and `/expenses/frequencies`.

**Component architecture**: Every screen has a mobile and a desktop variant. Components live in `src/components/pennies/mobile/` and `src/components/pennies/desktop/`. Routes render both, toggling visibility with `md:hidden` / `hidden md:block`. Never combine mobile and desktop logic into a single component.

**Domain library** (`src/lib/pennies.ts`): Core utilities for the expense domain — `formatVnd` (VND display), `formatVndShort` (compact axis labels: `₫1,7M` / `₫705k`), `periodSummary` (today/week/month/year totals; accepts optional third arg `opts?: { weekFreqIds?: ReadonlySet<number>; todayFreqIds?: ReadonlySet<number> }` for frequency-aware filtering), `catBreakdown` (category rollup with emoji + dot color), `monthSeries` (last N months for bar charts), and date helpers (`getPrevMonth`, `monthLabel`, `monthShort`, etc.). Always import from here rather than computing inline. `Expense.freq: number | null` holds the frequency id.

**i18n**: `react-i18next` with locale files at `src/lib/locales/en.ts` (source of truth) and `vi.ts`. `vi.ts` is typed against `en.ts` so adding a key to `en.ts` without adding it to `vi.ts` is a compile error. Use `useTranslation()` in all user-visible strings. Language detection uses the `locale` cookie (read server-side via `getLocaleFn()` from `src/lib/locale.ts` and client-side by i18next's `LanguageDetector`). Supported languages: `en`, `vi`.

**Categories**: `src/lib/categories.ts` exports `categoryColor(id)` → `{ dot, ink }` (pastel fill + text color). Category metadata (name, icon) comes from the API via `useCategories()` hook (`src/hooks/useCategories.ts`).

**Frequencies**: Expense frequencies (once, daily, weekly, monthly) come from the API via `useFrequencies()` (`src/hooks/useFrequencies.ts`). The `Expense` type includes `freq: number | null`.

## Library files

- `src/lib/constants.ts` — `ROUTES` (all route path strings), `SORT`/`FILTER` option types, and the `API_URL` env var. Always import route strings from here.
- `src/lib/expenses.ts` — server functions for expense CRUD (`getExpensesFn`, `getExpenseFn`, `createExpenseFn`, `updateExpenseFn`, `deleteExpenseFn`), `mapApiExpense()` converter, and the `ApiExpense` / `PaginatedExpenses` types.
- `src/lib/frequencies.ts` — `ApiFrequency` interface, `getFrequenciesFn()`, `frequenciesQueryOptions()`.
- `src/lib/locale.ts` — `getLocaleFn()` and `getThemeFn()` server functions that read the `locale` and `theme` cookies; called in root `beforeLoad`.
- `src/lib/i18n.ts` — i18next initialization with cookie-based language detection.
- `src/lib/themeStore.ts` — theme management (see **Theme** bullet above).

## Hooks

- `useUser()` — returns `SessionUser | null` from router context.
- `useCategories()` (`src/hooks/useCategories.ts`) — fetches categories for the current i18n language via `useSuspenseQuery`.
- `useFrequencies()` (`src/hooks/useFrequencies.ts`) — fetches frequencies for the current i18n language via `useSuspenseQuery`. Analogous to `useCategories()`.
- `useResendCooldown({ email })` (`src/hooks/useResendCooldown.ts`) — 30-second email-resend throttle backed by localStorage. Returns `{ secondsLeft: number, startCooldown: () => void }`.

## Testing

Vitest with jsdom (`vitest.config.ts`). Setup in `src/test/setup.ts` — adds jest-dom matchers and a `matchMedia` polyfill.

Wrap components under test in `TestProviders` from `src/test/test-providers.tsx`. It wires a fresh `QueryClient` pre-populated with `MOCK_CATEGORIES` and `MOCK_FREQUENCIES`, plus an `I18nextProvider`.

`src/test/i18n-wrapper.tsx` provides i18n helpers for tests that exercise translation strings.

## Design source

The Pennies design project lives at `https://claude.ai/design/p/019e2493-c653-7b67-9d8f-1d6a13fcafe2`. Use the `DesignSync` MCP tool (available after `/design-login`) to read design files and sync implementations.

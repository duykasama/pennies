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

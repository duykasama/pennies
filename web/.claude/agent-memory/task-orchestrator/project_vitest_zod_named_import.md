---
name: project-vitest-zod-named-import
description: vitest previously broke `import { z } from 'zod'` (named import resolved to undefined) until server.deps.inline included zod
metadata:
  type: project
---

Under this project's vitest config, `import { z } from 'zod'` resolved `z` as `undefined` at test time, even though the same import worked fine in `bun --bun run build` / production. Only the default export (`import z from 'zod'`) worked under vitest. Root cause: Vite/vitest's SSR module loading for zod's `index.js` was dropping the named `z` export during transform.

Fixed 2026-06-16 by adding to `vitest.config.ts`:

```ts
test: {
  server: {
    deps: { inline: ['zod'] },
  },
}
```

This forces vitest to process `zod` through its own transform pipeline instead of treating it as an external SSR dependency, which restores the named export.

**Why this surfaced now:** `src/lib/expenses.ts` and `src/lib/auth.ts` already used `createServerFn().inputValidator(z.object(...))` with the same named-import style, but no test file had ever transitively imported them — so the bug was latent. It was exposed when a new `src/lib/categories.ts` (added as part of the categories-from-API refactor) became reachable from component tests via `useCategories()` → `ExpenseRow.tsx` etc.

**How to apply:** If a future test failure shows `TypeError: undefined is not an object (evaluating 'z.object')` or any other zod-named-export-is-undefined symptom, check `vitest.config.ts` still has `server.deps.inline` including `'zod'` before assuming the schema/import code itself is wrong. Don't "fix" it by rewriting app code to use `import z from 'zod'` (default import) — that would be inconsistent with the existing `expenses.ts`/`auth.ts` convention; fix it at the vitest config level instead.

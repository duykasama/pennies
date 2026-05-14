---
name: import-type-style
description: ESLint enforces top-level type-only imports — never use inline `type` specifiers inside value imports
metadata:
  type: feedback
---

This project's ESLint config enforces `import/consistent-type-specifier-style` with the "top-level" rule.

Always split type imports into a separate `import type { ... }` statement rather than using inline `type` specifiers:

```ts
// Wrong — triggers lint error
import { foo, type Bar } from '#/lib/something'

// Correct
import { foo } from '#/lib/something'
import type { Bar } from '#/lib/something'
```

**Why:** ESLint config uses `import/consistent-type-specifier-style: ['error', 'top-level']`.

**How to apply:** Whenever writing any import that mixes runtime values and TypeScript types, always split into two import statements. This affects every component file.

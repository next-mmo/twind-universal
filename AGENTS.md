# Agent guide — Uniwind monorepo (`packages/ui`)

This document describes how the shared **`ui`** package is structured, how it relates to **React Native Reusables**, **UniWind**, and the **shadcn-style registry**, and what conventions agents should follow when editing or extending it.

## Role of `packages/ui`

The `ui` workspace package is the **shared React Native + UniWind surface** for the monorepo. It provides:

| Surface | Path | Purpose |
|--------|------|--------|
| **Reusables** | `reusables/components/ui/*`, exported via `src/reusables.ts` | shadcn-like primitives (Button, Card, UIText, …) built on `uniwind/components`. |
| **Blocks** | `src/blocks/*` | Composed marketing/e‑commerce-style sections; exported as `ui/blocks`. |
| **Primitives** | `src/primitives.ts` | Re-exports RN primitives from `uniwind/components` (View, Image, ScrollView, …). |
| **Recipes** | `src/recipes.ts` | Higher-level compositions (if present). |
| **UniWind helpers** | `src/uniwind.ts` | Package-level UniWind entry. |

Consumers import via package exports, for example:

- `import { Button, UIText } from 'ui/reusables'`
- `import { ShoppingCartBlock } from 'ui/blocks'`
- `import { View, Image } from 'uniwind/components'` (or `ui/primitives` where re-exported)

## UniWind and styling

- Styling uses **UniWind** (Tailwind CSS v4 **CSS-first** in `reusables/global.css`), not NativeWind.
- Primitives are imported from **`uniwind/components`** so `className` maps to UniWind/Tailwind.
- Shared `cn()` lives at `reusables/lib/utils.ts` (tailwind-merge).

Do **not** assume a root `tailwind.config.js`; theme tokens live in CSS (`@import "tailwindcss"`, `@import "uniwind"`, `@theme`, etc.).

## Reusables (`components.json`)

`packages/ui/components.json` follows the **shadcn** schema and points the CLI at:

- Tailwind CSS: `./reusables/global.css`
- Aliases: `./reusables/components`, `./reusables/lib/utils`, etc.

**Adding new primitives from the RNR CLI** is normally done from the **Expo app** (UniWind auto-detection), then syncing files into `packages/ui/reusables` — see team notes and `rnr-reusables` skill. Import aliases in this package use paths relative to `reusables/`, not `@/` from an app.

## Blocks — source layout

Blocks are **hand-authored** React Native components, not Next.js server blocks.

Current layout:

```
src/blocks/
├── index.ts                 # Barrel: re-exports all public blocks and types
├── types.ts                 # Shared prop types + re-exports shopping-cart types
├── marketing-blocks.tsx     # PageIntro, Stats, FeatureGrid, Callout, Summary, Surface grids
└── shopping-cart/
    ├── shopping-cart-block.tsx
    ├── types.ts
    └── index.ts
```

**Conventions:**

- Root container: `View` from `uniwind/components` (often `flex-col`, spacing via `gap-*`, `py-*`).
- Copy: `UIText` from `../reusables` with `variant` or `className` (zinc palette for muted text).
- Actions: `Button` with **`onPress`**, not `onClick`. Children are usually `UIText` so `TextClassContext` applies.
- Images: `Image` with `source={{ uri }}`, `resizeMode="cover"`, `accessibilityLabel`.
- No **`"use client"`** (web-only). No raw `<div>`, `<span>`, `<img>`, `<a>` unless the target is explicitly web-only (this package targets RN).

When adding a new block, prefer a **folder per block** (`src/blocks/<name>/`), export from `src/blocks/index.ts`, and add a **registry item** if the block should be installable via the CLI (see below).

## Registry (shadcn-compatible)

This repo maintains a **custom registry** aligned with [shadcn `registry.json`](https://ui.shadcn.com/docs/registry/registry-json):

| File | Role |
|------|------|
| `packages/ui/registry/registry.json` | Manifest: `$schema`, `name` (`uniwind`), `homepage`, `items[]`. |
| `packages/ui/registry/public/r/` | **Generated** JSON payloads (per-item files + index) produced by the shadcn CLI. |

**Build commands:**

- In `packages/ui`: `pnpm run registry:build`  
  → runs `shadcn build registry/registry.json -o registry/public/r -c .`
- At repo root: `pnpm run registry:build`  
  → Turbo runs the same task for the `ui` package (`outputs`: `registry/public/**`).

Each **item** lists `files[].path` relative to `packages/ui` (e.g. `src/blocks/shopping-cart/shopping-cart-block.tsx`). The build **inlines file contents** into `registry/public/r/<name>.json` for `pnpm dlx shadcn@latest add <url>`-style installs.

After changing block sources or registry metadata, **re-run `registry:build`** before committing generated artifacts (if your team tracks them) or in CI.

## TypeScript and exports

- Package `"exports"` in `packages/ui/package.json` define `ui`, `ui/blocks`, `ui/reusables`, etc.
- The docs app may alias `ui/blocks` to `packages/ui/src/blocks/index.ts` in Vite/tsconfig — keep those in sync if the barrel path changes.

## Conflicts to know

- Re-exporting types: `StatItem` and similar names may also appear in other subpackages (e.g. recipes). Avoid duplicate `export *` collisions when touching barrel files.

## Related docs

- [React Native Reusables](https://reactnativereusables.com/)
- [Create your own registry](https://reactnativereusables.com/docs/create-your-own-registry)
- [shadcn registry.json](https://ui.shadcn.com/docs/registry/registry-json)
- [registry-item.json](https://ui.shadcn.com/docs/registry/registry-item-json)
- UniWind: [uniwind.dev](https://uniwind.dev)

## Cursor skill: shadcn → UniWind conversion

For turning **web/shadcn (or shadcnblocks) snippets** into **this package’s RN + UniWind patterns**, use the project skill **`.cursor/skills/convert-shadcn2-uniwind`** (`SKILL.md`). It complements this file with step-by-step substitution rules and checklists.

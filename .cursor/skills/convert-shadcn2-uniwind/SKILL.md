---
name: convert-shadcn2-uniwind
description: >-
  Converts web shadcn/shadcnblocks/React-DOM snippets into React Native + UniWind
  code matching packages/ui (View, Image, UIText, Button onPress, reusables imports).
  Use when porting a shadcn block or component to this monorepo, replacing Next.js
  or DOM APIs, or when the user mentions shadcn-to-RN, UniWind port, or RNR blocks.
---

# Convert shadcn / web UI → UniWind (`packages/ui`)

## Goal

Produce components that:

- Import layout and images from **`uniwind/components`** (`View`, `Image`, …).
- Import design primitives from **`../reusables`** or **`ui/reusables`** (paths depend on file location).
- Use **`className`** with UniWind/Tailwind utilities (no `tailwind.config.js` in this package; CSS-first).
- Use RN event names (**`onPress`**, not `onClick`).

## Strip or replace (web-only)

| Web / Next | UniWind / RN |
|------------|----------------|
| `"use client"` | Omit |
| `<div>`, `<section>`, `<main>` | `View` |
| `<span>`, `<p>`, `<h1>`–`<h6>` | `UIText` (or `Text` from primitives if low-level) |
| `<img src>` | `<Image source={{ uri }} resizeMode="cover" />` + `accessibilityLabel` |
| `<a href>`, `Link` | `Button` / `Pressable` `onPress`, or app router `Link` outside this package |
| `onClick` | `onPress` |
| `lucide-react` icons | `UIText` for simple symbols (e.g. `×`), or project Icon component / `@expo/vector-icons` if available — do not add `lucide-react` to `packages/ui` |
| `AspectRatio` + `img` | Fixed-size `View` (e.g. `h-20 w-20 overflow-hidden rounded-md`) wrapping `Image` |
| `Separator` (Radix/web) | `Separator` from `../reusables` (UniWind `View`-based) |

## Imports (inside `packages/ui`)

Typical patterns:

- From `src/blocks/<feature>/foo.tsx`:
  - `import { View, Image } from 'uniwind/components'`
  - `import { Button, Separator, UIText } from '../../reusables'` (adjust depth)
  - `import { cn } from '../../../reusables/lib/utils'` (adjust depth to reach `reusables/lib/utils.ts`)

Match **existing files** in `src/blocks/` for depth and naming.

## Button and text

- Use **`Button`** from reusables; children should often be **`UIText`** so `TextClassContext` applies (see `ProfileCard` / shopping-cart block).
- **`size="lg"`**, **`variant="ghost"`**, **`size="icon"`** match the `button.tsx` variants in this repo.

## State and lists

- `useState` / `useMemo` from React behave the same; no `"use client"`.
- Use **`key`** on mapped `View`s as in React.

## After porting

1. Run **`pnpm run registry:build`** from repo root (or `packages/ui`) if you added or changed **registry** metadata under `packages/ui/registry/registry.json`.
2. Register new blocks in **`registry/registry.json`** with `type: "registry:block"` and `files[]` pointing at real paths under `packages/ui`.
3. Export new components from **`src/blocks/index.ts`** (and types from `types.ts` or a colocated `types.ts`).

## Do not

- Introduce `nativewind` / `cssInterop` — UniWind uses **`withUniwind`** where needed in reusables.
- Use web-only shadcn blocks that rely on **RSC**, **next/image**, or **URL routes** without rewriting.

## Quick checklist

- [ ] No DOM tags; `View` / `Image` / `UIText` / reusables primitives
- [ ] `onPress` on pressables; `accessibilityLabel` on icon-only controls and images
- [ ] `cn()` from `reusables/lib/utils` for conditional classes
- [ ] Barrel export + registry item if distributing via shadcn CLI
- [ ] Rebuild `registry/public/r` after registry changes

For package layout and agent context, see repo root **`AGENTS.md`**.

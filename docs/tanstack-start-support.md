# RFC: TanStack Start Support for Uniwind

**Status:** ✅ Validated (working prototype in `apps/tanstack-start-example/`)  
**Author:** (auto-generated analysis)  
**Date:** 2026-03-14  
**Target:** TanStack Start ≥ 1.166.x with Vite 7.x

---

## Summary

TanStack Start is built on **Vite**. Uniwind already has a Vite plugin. This makes TanStack Start support **significantly simpler** than Next.js — the existing `uniwind/vite` plugin works directly in `vite.config.ts` with a small compatibility shim.

A working prototype has been built and validated at `apps/tanstack-start-example/`.

---

## Validated Results

| Feature | Status | Notes |
|---|---|---|
| CSS generation & theming | ✅ Works | `buildCSS()` runs on `buildStart` hook |
| LightningCSS visitor | ✅ Works | Theme-scoped CSS variables generated |
| Tailwind utility classes | ✅ Works | All classes applied correctly |
| Dark mode | ✅ Works | `Uniwind.setTheme('dark')` switches instantly |
| Custom themes (premium) | ✅ Works | Three themes validated |
| Counter / interactivity | ✅ Works | `useState`, `onPress` work |
| Pressable with active state | ✅ Works | `active:opacity-80` applies |
| Component rendering | ✅ Works | View, Text, Pressable, ScrollView |
| Dev server HMR | ✅ Works | File changes trigger hot reload |

---

## Discoveries from Implementation

### 1. `vite-plugin-rnw` cannot be used

`vite-plugin-rnw` internally imports `@vitejs/plugin-react`, which causes a plugin ordering conflict:

```
Error: Plugin order error: '@vitejs/plugin-react' is placed before '@tanstack/router-plugin'.
```

**Solution:** Use `resolve.alias` in Vite config instead:

```typescript
resolve: {
    alias: {
        'react-native': 'react-native-web',
    },
},
```

### 2. `optimizeDeps.exclude` conflicts with SSR

The Uniwind Vite plugin sets `optimizeDeps.exclude: ['uniwind', 'react-native']`. TanStack Start's SSR treats these as entry points, causing:

```
Error: The entry point "react-native" cannot be marked as external
```

**Solution:** A small Vite plugin that removes these exclusions from the final config:

```typescript
function fixOptimizeDeps(): Plugin {
    return {
        name: 'fix-optimize-deps-for-ssr',
        configResolved(config) {
            const exclude = config.optimizeDeps?.exclude
            if (Array.isArray(exclude)) {
                const toRemove = ['uniwind', 'react-native']
                for (const item of toRemove) {
                    const idx = exclude.indexOf(item)
                    if (idx !== -1) exclude.splice(idx, 1)
                }
            }
        },
    }
}
```

### 3. SSR must be disabled for routes using RN components

`react-native-web`'s `prefixStyles` module fails in Vite's SSR module runner due to CJS/ESM interop:

```
(0, __vite_ssr_import_0__.default) is not a function
```

**Solution:** Set `ssr: false` on routes that use Uniwind/RN components:

```typescript
export const Route = createFileRoute('/')({
    ssr: false,
    component: Home,
})
```

### 4. Import from `'uniwind/components'`, not `'react-native'`

Plain `react-native-web` components (via the `react-native` alias) do NOT pass `className` to the DOM. Uniwind's web components handle the `className` → `toRNWClassName()` conversion.

```typescript
// ❌ Wrong — className won't be applied
import { View, Text } from 'react-native'

// ✅ Correct — className works with Tailwind
import { View, Text } from 'uniwind/components'
```

### 5. Plugin ordering matters

TanStack Start's router plugin must come BEFORE `@vitejs/plugin-react`:

```typescript
plugins: [
    tailwindcss(),
    uniwind({ ... }),
    fixOptimizeDeps(),
    tsconfigPaths(),
    tanstackStart(),      // MUST be before viteReact()
    viteReact(),          // MUST be after tanstackStart()
],
```

---

## Working Configuration

### `vite.config.ts`

```typescript
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { uniwind } from 'uniwind/vite'

function fixOptimizeDeps(): Plugin {
    return {
        name: 'fix-optimize-deps-for-ssr',
        configResolved(config) {
            const exclude = config.optimizeDeps?.exclude
            if (Array.isArray(exclude)) {
                for (const item of ['uniwind', 'react-native']) {
                    const idx = exclude.indexOf(item)
                    if (idx !== -1) exclude.splice(idx, 1)
                }
            }
        },
    }
}

export default defineConfig({
    server: { port: 3000 },
    resolve: {
        alias: { 'react-native': 'react-native-web' },
    },
    plugins: [
        tailwindcss(),
        uniwind({
            cssEntryFile: './src/styles/app.css',
            extraThemes: ['premium'],
        }),
        fixOptimizeDeps(),
        tsconfigPaths(),
        tanstackStart(),
        viteReact(),
    ],
})
```

### `src/routes/index.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { View, Text, Pressable } from 'uniwind/components'
import { Uniwind, useUniwind } from 'uniwind'

export const Route = createFileRoute('/')({
    ssr: false,
    component: Home,
})

function Home() {
    const { theme } = useUniwind()
    return (
        <View className="flex-1 min-h-screen bg-background justify-center items-center">
            <Text className="text-4xl font-bold text-foreground">
                Uniwind + TanStack Start
            </Text>
            <Pressable onPress={() => Uniwind.setTheme('dark')}>
                <Text className="text-accent">Switch to Dark</Text>
            </Pressable>
        </View>
    )
}
```

---

## Comparison: TanStack Start vs Next.js 16

| | TanStack Start | Next.js 16 |
|---|---|---|
| **New plugin needed** | No (reuse `uniwind/vite`) | Yes (new `uniwind/next`) |
| **Extra shim needed** | Small `fixOptimizeDeps` plugin | PostCSS adapter + config wrapper |
| **CSS transformation** | Already works (LightningCSS) | Needs PostCSS adapter |
| **Module aliasing** | `resolve.alias` | `resolveAlias` + Webpack config |
| **Server Components** | Not a concern (client-first) | Forces `'use client'` everywhere |
| **SSR** | Per-route control (`ssr: false`) | Always-on |
| **Core code changes** | None | None |
| **Validated working?** | ✅ Yes | ❌ Not yet |
| **Risk level** | Low | Medium |

---

## Remaining Work

| Task | Hours | Priority |
|---|---|---|
| Test production build (`vite build`) | 1 | High |
| Test more components (Switch, TextInput, Image, etc.) | 2 | Medium |
| Investigate if SSR can work with RNW (prefixStyles fix) | 2 | Low |
| Add `withUniwind` HOC examples | 1 | Medium |
| Add navigation between routes | 1 | Medium |
| Document setup in README | 1 | High |
| **Total remaining** | **~8 hours** | |

---

## Open Questions (Updated)

1. **Should the `fixOptimizeDeps` shim be built into the Uniwind Vite plugin?** It could detect TanStack Start and skip the `optimizeDeps.exclude` automatically.

2. **Import path**: Should users import from `'uniwind/components'` or should the `react-native` alias be updated in the Vite plugin to point to Uniwind's components instead of `react-native-web`?

3. **SSR support**: Can the `prefixStyles` CJS/ESM interop issue be patched upstream in `react-native-web`, or should we accept `ssr: false` as the standard approach?

4. **Minimum versions**: Should we document minimum versions (`@tanstack/react-start ≥ 1.166.x`, `vite ≥ 7.x`)?

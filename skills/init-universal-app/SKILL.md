---
name: init-universal-app
description: >
  Initialize a new universal app in the uniwind monorepo with 100% shared code
  across React Native (bare), Expo, and Web (TanStack Start). Triggers on: "new app",
  "create app", "init universal", "add app to monorepo", "scaffold project",
  "new universal project", "cross-platform app".
---

# Init Universal App — Uniwind Monorepo

> Scaffolds a new universal app with a shared package, a bare React Native app,
> an Expo app, and a TanStack Start web app — all with 100% shared screens and components.

## Architecture Overview

```
packages/<name>/           ← Shared code (screens, features, routes)
├── src/
│   ├── routes.tsx         ← Route tree + root layout (single source of truth)
│   ├── screens/           ← Screen components
│   └── features/          ← Business logic, context, types, components

apps/<name>-bare/          ← React Native (bare CLI, no Expo)
├── android/               ← Generated native project
├── src/
│   ├── App.tsx            ← Imports shared routeTree, adds memoryHistory
│   ├── global.css         ← Tailwind entry with @source to shared package
│   └── index.ts           ← Re-exports App
├── metro.config.js        ← withUniwindConfig + monorepo watchFolders + @<name> alias
└── index.js               ← AppRegistry entry

apps/<name>-expo/          ← React Native (Expo Go)
├── src/
│   ├── App.tsx            ← Same as bare — imports shared routeTree via @<name> alias
│   └── global.css         ← Tailwind entry with @source to shared package
├── metro.config.js        ← Expo metro config + @<name> alias
└── index.ts               ← registerRootComponent entry

apps/<name>-web/           ← TanStack Start (Vite + SSR)
├── src/
│   ├── routes/
│   │   ├── __root.tsx     ← HTML shell + shared root layout
│   │   ├── index.tsx      ← Maps to shared screen (ssr: false)
│   │   └── <nested>/     ← Additional route files
│   ├── styles/app.css     ← Tailwind entry with @source to shared package
│   ├── router.tsx         ← TanStack router factory
│   └── client.tsx         ← Hydration entry
└── vite.config.ts         ← Vite + TanStack Start + uniwind plugin
```

## Step 1: Create the Shared Package

Create `packages/<name>/src/` with screens, features, and a shared route tree.

### 1a. Route Tree (`packages/<name>/src/routes.tsx`)

This is the **single source of truth** for routes. Both apps import from here.

```tsx
import { createRootRoute, createRoute, Outlet } from 'uniwind-router'
// Import your providers and screens
import { AppProvider } from './features/<name>/AppContext'
import { HomeScreen } from './screens/HomeScreen'

// Root layout wraps every screen with providers
export const rootRoute = createRootRoute({
    component: () => (
        <AppProvider>
            <Outlet />
        </AppProvider>
    ),
})

export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomeScreen,
})

// Add more routes as needed
// export const detailRoute = createRoute({ ... })

export const routeTree = rootRoute.addChildren([indexRoute])
```

### 1b. Screens (`packages/<name>/src/screens/`)

Import components from `uniwind/components` for cross-platform rendering:

```tsx
import { View, Text, Pressable, ScrollView } from 'uniwind/components'
import { useParams, Link, useNavigate } from 'uniwind-router'

export function HomeScreen() {
    return (
        <View className="flex-1 bg-white dark:bg-zinc-950">
            <Text className="text-3xl font-bold">Home</Text>
        </View>
    )
}
```

**Critical**: Import from `'uniwind/components'`, NOT from `'react-native'`.
This resolves to `react-native` on native and to web-compatible components on web.

### 1c. Features (`packages/<name>/src/features/`)

Standard React patterns — context, hooks, types, components:

```
features/<domain>/
├── AppContext.tsx      ← React context + provider
├── types.ts           ← Shared types
└── components/        ← Reusable UI components
    ├── SomeInput.tsx
    └── SomeItem.tsx
```

## Step 2: Create the Bare React Native App

### 2a. Generate the native project

```bash
# From monorepo root
npx -y @react-native-community/cli init <AppName> \
    --directory /tmp/rn-scaffold \
    --version 0.83.2 \
    --skip-install \
    --skip-git-init \
    --pm bun

# Copy only the android directory
cp -r /tmp/rn-scaffold/android apps/<name>-bare/android
rm -rf /tmp/rn-scaffold
```

### 2b. Fix Android paths for monorepo

**`android/settings.gradle`** — point to hoisted node_modules:

```groovy
pluginManagement { includeBuild("../../../node_modules/@react-native/gradle-plugin") }
plugins { id("com.facebook.react.settings") }
extensions.configure(com.facebook.react.ReactSettingsExtension){ ex -> ex.autolinkLibrariesFromCommand() }
rootProject.name = '<AppName>'
include ':app'
includeBuild('../../../node_modules/@react-native/gradle-plugin')
```

**`android/app/build.gradle`** — set the `react {}` block paths:

```groovy
react {
    /* Folders — adjusted for monorepo (hoisted node_modules) */
    root = file("../../")                                          // app's own root (where package.json lives)
    reactNativeDir = file("../../../../node_modules/react-native") // monorepo root node_modules
    codegenDir = file("../../../../node_modules/@react-native/codegen")
    cliFile = file("../../../../node_modules/react-native/cli.js")

    autolinkLibrariesWithApp()
}
```

**Path reference** (from `android/app/`):
- `../../` → `apps/<name>-bare/` (app root)
- `../../../../node_modules/` → monorepo root `node_modules/`

### 2c. App entry files

**`package.json`**:

```json
{
    "name": "<name>-bare",
    "version": "0.0.1",
    "private": true,
    "scripts": {
        "android": "react-native run-android",
        "ios": "react-native run-ios",
        "start": "react-native start"
    },
    "dependencies": {
        "@tanstack/react-router": "^1.166.8",
        "react": "catalog:",
        "react-native": "catalog:",
        "uniwind": "workspace:*",
        "uniwind-router": "workspace:*"
    },
    "devDependencies": {
        "@babel/core": "7.25.2",
        "@babel/preset-env": "7.25.3",
        "@babel/runtime": "7.25.0",
        "@react-native-community/cli": "20.0.2",
        "@react-native-community/cli-platform-android": "20.0.2",
        "@react-native/babel-preset": "0.82.1",
        "@react-native/metro-config": "0.82.1",
        "@types/react": "catalog:",
        "typescript": "catalog:"
    }
}
```

**`app.json`**:

```json
{
    "name": "<AppName>",
    "displayName": "<App Display Name>"
}
```

> The `name` must match `getMainComponentName()` in `MainActivity.kt`.

**`index.js`**:

```js
import { AppRegistry } from 'react-native'
import { name as appName } from './app.json'
import { App } from './src'

AppRegistry.registerComponent(appName, () => App)
```

**`src/index.ts`**:

```ts
export { App } from './App'
```

**`src/App.tsx`**:

```tsx
import './global.css'
import { createRouter, createMemoryHistory, RouterProvider } from 'uniwind-router'
import { routeTree } from '@<name>/routes'  // resolved by Metro extraNodeModules + tsconfig paths

const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export function App() {
    return <RouterProvider router={router} />
}
```

**`src/global.css`** — MUST include `@source` for the shared package:

```css
@import 'tailwindcss';
@import 'uniwind';

/* Scan shared components for Tailwind class extraction */
@source "../../../packages/<name>/src";

@theme {
    --color-primary: oklch(0.55 0.22 270);
}
```

**`metro.config.js`**:

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = {
    watchFolders: [
        path.join(workspaceRoot, 'packages/uniwind'),
        path.join(workspaceRoot, 'packages/uniwind-router'),
        path.join(workspaceRoot, 'packages/<name>/src'),
        path.join(workspaceRoot, 'node_modules'),
    ],
    resolver: {
        nodeModulesPaths: [
            path.join(projectRoot, 'node_modules'),
            path.join(workspaceRoot, 'node_modules'),
        ],
        // Path alias: @<name>/* → packages/<name>/src/*
        extraNodeModules: {
            '@<name>': path.join(workspaceRoot, 'packages/<name>/src'),
        },
        unstable_enableSymlinks: true,
        unstable_enablePackageExports: true,
    },
}

module.exports = withUniwindConfig(mergeConfig(getDefaultConfig(__dirname), config), {
    cssEntryFile: './src/global.css',
    dtsPath: './src/uniwind.d.ts',
})
```

**`tsconfig.json`**:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "jsx": "react-jsx",
        "strict": true,
        "skipLibCheck": true,
        "paths": {
            "@<name>/*": ["../../packages/<name>/src/*"]
        }
    },
    "include": ["src", "index.js"]
}
```

**`babel.config.js`**:

```js
module.exports = { presets: ['@react-native/babel-preset'] }
```

## Step 3: Create the Expo App (Optional)

If you also want an Expo variant (for Expo Go / EAS builds), create `apps/<name>-expo/`.
The App.tsx is **identical** to the bare app — same shared route tree, same alias.

**`package.json`**:

```json
{
    "name": "<name>-expo",
    "version": "1.0.0",
    "main": "index.ts",
    "private": true,
    "scripts": {
        "start": "expo start -c",
        "dev": "expo start -c",
        "android": "expo start --android",
        "ios": "expo start --ios"
    },
    "dependencies": {
        "@expo/metro-runtime": "55.0.6",
        "@tanstack/react-router": "^1.166.8",
        "expo": "catalog:",
        "expo-status-bar": "55.0.4",
        "react": "catalog:",
        "react-native": "catalog:",
        "tailwindcss": "catalog:",
        "uniwind": "workspace:*",
        "uniwind-router": "workspace:*"
    },
    "devDependencies": {
        "@babel/core": "7.28.5",
        "@types/react": "catalog:",
        "typescript": "catalog:"
    }
}
```

**`index.ts`**:

```ts
import { registerRootComponent } from 'expo'
import { App } from './src/App'

registerRootComponent(App)
```

**`src/App.tsx`** — identical to bare:

```tsx
import './global.css'
import { createRouter, createMemoryHistory, RouterProvider } from 'uniwind-router'
import { routeTree } from '@<name>/routes'

const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export function App() {
    return <RouterProvider router={router} />
}
```

**`metro.config.js`**:

```js
const { getDefaultConfig } = require('expo/metro-config')
const { withUniwindConfig } = require('uniwind/metro')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

config.watchFolders = [
    path.join(workspaceRoot, 'packages/uniwind'),
    path.join(workspaceRoot, 'packages/uniwind-router'),
    path.join(workspaceRoot, 'packages/<name>/src'),
    path.join(workspaceRoot, 'node_modules'),
]

config.resolver.nodeModulesPaths = [
    path.join(projectRoot, 'node_modules'),
    path.join(workspaceRoot, 'node_modules'),
]

config.resolver.extraNodeModules = {
    '@<name>': path.join(workspaceRoot, 'packages/<name>/src'),
}
config.resolver.unstable_enableSymlinks = true
config.resolver.unstable_enablePackageExports = true

module.exports = withUniwindConfig(config, {
    cssEntryFile: './src/global.css',
    dtsPath: './src/uniwind.d.ts',
})
```

**`src/global.css`**, **`tsconfig.json`**, **`babel.config.js`** — same as bare app.

## Step 4: Create the TanStack Start Web App

### 3a. Package and config files

**`package.json`**:

```json
{
    "name": "<name>-web",
    "private": true,
    "type": "module",
    "scripts": {
        "dev": "vite dev",
        "build": "vite build",
        "start": "node .output/server/index.mjs"
    },
    "dependencies": {
        "@tailwindcss/vite": "4.1.17",
        "@tanstack/react-router": "^1.166.8",
        "@tanstack/react-start": "^1.166.9",
        "react": "catalog:",
        "react-dom": "catalog:",
        "react-native": "catalog:",
        "react-native-web": "catalog:",
        "tailwindcss": "catalog:",
        "uniwind": "workspace:*",
        "uniwind-router": "workspace:*"
    },
    "devDependencies": {
        "@types/react": "catalog:",
        "@types/react-dom": "catalog:",
        "@vitejs/plugin-react": "5.1.1",
        "typescript": "catalog:",
        "vite": "7.2.6",
        "vite-tsconfig-paths": "4.3.2"
    }
}
```

**`vite.config.ts`**:

```ts
import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { uniwind } from 'uniwind/vite'

/**
 * TanStack Start treats dependencies as entry points for SSR.
 * The Uniwind Vite plugin excludes 'uniwind' and 'react-native'
 * from optimizeDeps, which conflicts with esbuild. Fix it.
 */
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
    server: { port: 3001 },
    resolve: {
        alias: { 'react-native': 'react-native-web' },
    },
    plugins: [
        tailwindcss(),
        uniwind({ cssEntryFile: './src/styles/app.css' }),
        fixOptimizeDeps(),
        tsconfigPaths(),
        tanstackStart(),
        viteReact(),
    ],
})
```

**`tsconfig.json`**:

```json
{
    "compilerOptions": {
        "target": "ES2022",
        "lib": ["ES2022", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": true,
        "verbatimModuleSyntax": true,
        "moduleDetection": "force",
        "noEmit": true,
        "jsx": "react-jsx",
        "strict": true,
        "skipLibCheck": true,
        "erasableSyntaxOnly": true,
        "paths": {
            "~/*": ["./src/*"],
            "@<name>/*": ["../../packages/<name>/src/*"]
        }
    },
    "include": ["src", "uniwind-types.d.ts", "vite.config.ts"]
}
```

### 3b. Route files

TanStack Start uses **file-based routing**. The route files are thin wrappers
that map to shared screens.

**`src/routes/__root.tsx`** — HTML shell + shared root layout:

```tsx
/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { AppProvider } from '@<name>/features/<domain>/AppContext'
import '~/styles/app.css'

export const Route = createRootRoute({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: '<App Title>' },
        ],
    }),
    component: RootComponent,
})

function RootComponent() {
    return (
        <RootDocument>
            <AppProvider>
                <Outlet />
            </AppProvider>
        </RootDocument>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    return (
        <html>
            <head><HeadContent /></head>
            <body style={{ margin: 0, height: '100vh' }}>
                {children}
                <Scripts />
            </body>
        </html>
    )
}
```

**`src/routes/index.tsx`** — maps to shared screen:

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { HomeScreen } from '@<name>/screens/HomeScreen'

export const Route = createFileRoute('/')(  {
    ssr: false, // react-native-web requires browser APIs
    component: HomeScreen,
})
```

**`src/styles/app.css`** — MUST include `@source` for shared package:

```css
@import 'tailwindcss';
@import 'uniwind';

/* Scan shared components for Tailwind class extraction */
@source "../../../../packages/<name>/src";
```

**`src/router.tsx`**:

```tsx
import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
    return createRouter({ routeTree, scrollRestoration: true })
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>
    }
}
```

**`src/client.tsx`**:

```tsx
import { StartClient } from '@tanstack/react-start/client'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'

hydrateRoot(
    document,
    <StrictMode>
        <StartClient />
    </StrictMode>,
)
```

## Step 5: Install Dependencies & Build

```bash
# From monorepo root
bun install

# Build the router package first (needed by both apps)
cd packages/uniwind-router && bun run build && cd ../..
```

## Step 6: Run & Verify

### Native (Android)

```bash
cd apps/<name>-bare

# Build the Android APK
cd android && ./gradlew assembleDebug && cd ..

# Start Metro + launch on emulator
npx react-native start --port 8081
# In another terminal:
npx react-native run-android --no-packager
```

### Expo

```bash
cd apps/<name>-expo
npx expo start -c
# Press 'a' to open on Android emulator
```

### Web

```bash
cd apps/<name>-web
bun run dev
# Open http://localhost:3001
```

## Path Alias Setup

All apps use `@<name>/*` aliases for clean imports from the shared package.

### How it works

| Layer | Config | Handles |
|---|---|---|
| **TypeScript** | `tsconfig.json` `paths` | Editor intellisense + type checking |
| **Metro** (bare/expo) | `resolver.extraNodeModules` | Runtime module resolution |
| **Vite** (web) | `vite-tsconfig-paths` plugin | Reads tsconfig paths automatically |
| **CSS `@source`** | Relative path only | ❌ Does NOT support aliases |

### Example

```tsx
// ✅ TypeScript + Metro/Vite — alias works
import { routeTree } from '@<name>/routes'
import { HomeScreen } from '@<name>/screens/HomeScreen'

// ❌ CSS @source — aliases NOT supported, must use relative path
@source "../../../packages/<name>/src";
```

## Common Gotchas

### Styles not rendering on native
The `global.css` is missing `@source` for the shared package. Add:
```css
@source "../../../packages/<name>/src";
```

### `Cannot find module 'uniwind/components'`
The `tsconfig.json` (root or app-level) is missing `"moduleResolution": "bundler"`.
Uniwind uses `package.json` `exports` maps which require `bundler` or `node16` resolution.

### Gradle `BUILD FAILED` — path not found
The `android/settings.gradle` and `android/app/build.gradle` paths must account
for monorepo hoisting. `node_modules` is at the **workspace root**, not the app root:
- `settings.gradle`: `../../../node_modules/@react-native/gradle-plugin`
- `app/build.gradle` `reactNativeDir`: `../../../../node_modules/react-native`

### Metro not finding shared package files
Add the shared package to `watchFolders` in `metro.config.js`:
```js
watchFolders: [
    path.join(workspaceRoot, 'packages/<name>/src'),
    // ... other packages
]
```

### Web SSR errors with react-native-web
Set `ssr: false` on route files that use react-native-web components:
```tsx
export const Route = createFileRoute('/')(  {
    ssr: false,
    component: HomeScreen,
})
```

### `app.json` name mismatch
The `name` in `app.json` must **exactly match** the `getMainComponentName()` return
value in `android/.../MainActivity.kt`. Case-sensitive.

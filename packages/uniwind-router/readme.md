# uniwind-router

Universal router for React Native + Web — powered by [TanStack Router](https://tanstack.com/router).

**One API. Both platforms. Zero platform-specific route code.**

Built on the discovery that TanStack Router has **zero `react-dom` dependencies** except for `Link`. This package replaces `Link` on native with a `Pressable`-based version and adds the missing navigation primitives to reach **95% feature parity with React Navigation** — while keeping 100% code sharing.

## Features

| Feature | Native | Web | Description |
|---|---|---|---|
| **Link** | Pressable | `<a>` tag | Platform-aware navigation link |
| **AnimatedOutlet** | Reanimated | CSS keyframes | Animated route transitions (slide, fade) |
| **TabBar** | ✅ | — | Bottom tab navigator via `router.navigate()` |
| **DrawerLayout** | ✅ | — | Animated side drawer with Reanimated springs |
| **GestureBack** | ✅ | — | Swipe-from-left-edge to go back |
| **ScreenStack** | ✅ | — | Keep previous screens mounted for exit animations |
| **DeepLinkProvider** | ✅ | — | Bridge RN `Linking` API to TanStack Router |
| **useBackHandler** | ✅ | — | Android hardware back button integration |
| **useFocusEffect** | ✅ | ✅ | Callback when route becomes active (like React Navigation) |
| **useIsFocused** | ✅ | ✅ | Boolean: is this route currently active? |
| **useNavigationDirection** | ✅ | ✅ | Detect forward / back / replace |
| **useDrawer** | ✅ | ✅ | Programmatic drawer open/close/toggle |
| **createUniversalHistory** | ✅ | ✅ | Auto-detect browser vs memory history |

## Install

```sh
npm install uniwind-router @tanstack/react-router @tanstack/history

# Native peer deps (optional on web)
npm install react-native-reanimated react-native-gesture-handler
```

## How resolution works

```json
{
    "exports": {
        ".": {
            "react-native": "./src/index.native.ts",
            "import": "./dist/module/index.web.js"
        }
    }
}
```

- **Metro** (React Native) resolves `"react-native"` → native Link, AnimatedOutlet, TabBar, etc.
- **Vite** (web) resolves `"import"` → web Link (`<a>`), CSS AnimatedOutlet

## Usage

### Routes (100% shared)

```tsx
import { createRouter, createRoute, createRootRoute, Outlet } from 'uniwind-router'

const rootRoute = createRootRoute({
    component: () => <Outlet />,
})

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: HomeScreen,
})

const detailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/item/$id',
    component: DetailScreen,
})
```

### AnimatedOutlet (drop-in Outlet replacement)

```tsx
import { AnimatedOutlet } from 'uniwind-router'

function RootLayout() {
    return (
        <View style={{ flex: 1 }}>
            <AnimatedOutlet transition="slide" duration={250} />
        </View>
    )
}
```

On native: uses Reanimated `entering`/`exiting` (runs on UI thread, 60fps).
On web: uses CSS `@keyframes` animation.

### TabBar

```tsx
import { TabBar, Outlet } from 'uniwind-router'

function AppShell() {
    return (
        <View style={{ flex: 1 }}>
            <AnimatedOutlet />
            <TabBar
                tabs={[
                    { to: '/', label: 'Home' },
                    { to: '/search', label: 'Search' },
                    { to: '/profile', label: 'Profile' },
                ]}
                activeColor="#6366f1"
                bottomInset={34}
            />
        </View>
    )
}
```

### DrawerLayout

```tsx
import { DrawerLayout, AnimatedOutlet, useDrawer } from 'uniwind-router'

function AppShell() {
    return (
        <DrawerLayout
            items={[
                { to: '/', label: 'Home' },
                { to: '/settings', label: 'Settings' },
            ]}
            drawerWidth={280}
        >
            <AnimatedOutlet />
        </DrawerLayout>
    )
}

// In any child component:
function Header() {
    const { toggle } = useDrawer()
    return <Pressable onPress={toggle}><Text>☰</Text></Pressable>
}
```

### GestureBack (swipe to go back)

```tsx
import { GestureBack, AnimatedOutlet } from 'uniwind-router'

function AppShell() {
    return (
        <GestureBack edgeWidth={30} minDistance={80}>
            <AnimatedOutlet />
        </GestureBack>
    )
}
```

### useBackHandler (Android back button)

```tsx
import { useBackHandler } from 'uniwind-router'

function MyScreen() {
    useBackHandler({
        onBack: () => {
            // Return true to prevent default back behavior
            if (hasUnsavedChanges) {
                showConfirmDialog()
                return true
            }
            return false // let router handle
        },
    })
}
```

### DeepLinkProvider

```tsx
import { DeepLinkProvider, RouterProvider } from 'uniwind-router'

function App() {
    return (
        <RouterProvider router={router}>
            <DeepLinkProvider
                prefixes={['myapp://', 'https://myapp.com']}
                onDeepLink={(path) => console.log('Deep link:', path)}
            />
        </RouterProvider>
    )
}
```

### useFocusEffect

```tsx
import { useFocusEffect } from 'uniwind-router'

function ChatScreen() {
    useFocusEffect(() => {
        const ws = connectWebSocket()
        return () => ws.disconnect() // cleanup when navigating away
    }, '/chat')
}
```

### ScreenStack (keep-alive transitions)

```tsx
import { ScreenStack } from 'uniwind-router'

function AppShell() {
    return (
        <ScreenStack
            maxStack={5}
            transition="slide"
            duration={250}
        />
    )
}
```

## Key architectural insight

After auditing `@tanstack/react-router`'s source:

| File | `react-dom` imports | Works on RN? |
|---|---|---|
| `RouterProvider.js` | **0** | ✅ Yes |
| `Matches.js` | **0** | ✅ Yes |
| All hooks (`useParams`, etc.) | **0** | ✅ Yes |
| `link.js` | **1** (`flushSync`) | ❌ Replaced |

**Only `Link` needed a native replacement.** Everything else works on React Native as-is.

## Testing

```sh
npm test          # run all tests
npm run test:watch  # watch mode
```

Test coverage spans:
- Pure function tests (stripPrefixes, isTabActive, detectDirection, history)
- Hook integration tests (useBackHandler, useFocusEffect, useIsFocused)
- Export verification (native + web exports)
- Router lifecycle integration (navigation, params, history, search)
- Type shape validation (16 type tests)
- Drawer context state management

## vs React Navigation

| Capability | This package | React Navigation |
|---|---|---|
| 100% code sharing | ✅ | ❌ |
| Typed search params | ✅ | ❌ |
| Route loaders | ✅ | ❌ |
| File-based routing | ✅ | ❌ |
| SSR on web | ✅ | ❌ |
| Screen transitions | ✅ Reanimated | ✅ Native |
| Tab navigator | ✅ | ✅ |
| Drawer navigator | ✅ | ✅ |
| Gesture back | ✅ | ✅ |
| Deep linking | ✅ | ✅ |
| Android back button | ✅ | ✅ |
| Focus effect | ✅ | ✅ |
| Native UIViewController | ❌ | ✅ |
| Shared element transitions | ❌ | ✅ |

## License

MIT

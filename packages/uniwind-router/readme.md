# uniwind-router

Universal router for React Native + Web — powered by [TanStack Router](https://tanstack.com/router).

**One API. Both platforms. Zero platform-specific route code.**

## How it works

`uniwind-router` re-exports TanStack Router with a platform-aware `Link` component:

| Platform | Link renders as | History type |
|---|---|---|
| **Web** (Vite, TanStack Start) | `<a>` tag (SEO, cmd+click, right-click) | Browser history (URL-based) |
| **React Native** (Metro) | `Pressable` + `router.navigate()` | Memory history (in-memory) |

Everything else (`RouterProvider`, `useParams`, `useNavigate`, `createRoute`, etc.) is re-exported directly from `@tanstack/react-router` — these are **already platform-agnostic** with zero `react-dom` dependencies.

## Install

```sh
# bun
bun add uniwind-router

# npm
npm install uniwind-router
```

## Usage

### Define routes (100% shared)

```tsx
// routes.ts — same file, both platforms
import { createRouter, createRoute, createRootRoute, Outlet } from 'uniwind-router'
import { TodoListScreen } from './screens/TodoListScreen'
import { TodoDetailScreen } from './screens/TodoDetailScreen'

const rootRoute = createRootRoute({
    component: () => <Outlet />,
})

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: TodoListScreen,
})

const todoDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/todo/$id',
    component: TodoDetailScreen,
})

const routeTree = rootRoute.addChildren([indexRoute, todoDetailRoute])

export const router = createRouter({
    routeTree,
    // On web → auto browser history
    // On native → auto memory history
    history: createUniversalHistory(),
})
```

### Use hooks (100% shared)

```tsx
// TodoDetailScreen.tsx — same file, both platforms
import { View, Text, Pressable } from 'uniwind/components'
import { useParams, useNavigate, Link } from 'uniwind-router'

export function TodoDetailScreen() {
    const { id } = useParams({ from: '/todo/$id' })
    const navigate = useNavigate()

    return (
        <View className="flex-1 bg-background p-6">
            <Link to="/">
                <Text className="text-accent">← Back</Text>
            </Link>

            <Text className="text-2xl font-bold text-foreground mt-4">
                Todo #{id}
            </Text>

            <Pressable onPress={() => navigate({ to: '/' })}>
                <Text className="text-red-500 mt-4">Delete</Text>
            </Pressable>
        </View>
    )
}
```

### Navigate with Link (100% shared)

```tsx
// TodoItem.tsx — same file, both platforms
import { View, Text } from 'uniwind/components'
import { Link } from 'uniwind-router'

export function TodoItem({ todo }) {
    return (
        <Link to="/todo/$id" params={{ id: todo.id }}>
            <View className="flex-row items-center px-6 py-4">
                <Text className="text-foreground">{todo.text}</Text>
                <Text className="text-muted ml-auto">›</Text>
            </View>
        </Link>
    )
}
```

## How resolution works

The package uses Node.js [conditional exports](https://nodejs.org/api/packages.html#conditional-exports):

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

- **Metro** (React Native bundler) resolves the `"react-native"` condition → native Link (Pressable)
- **Vite** (web bundler) resolves the `"import"` condition → web Link (`<a>` tag)

## Key insight

After auditing `@tanstack/react-router`'s source, we found:

| File | `react-dom` imports | `document`/`window` usage |
|---|---|---|
| `RouterProvider.js` | **0** ✅ | **0** ✅ |
| `Matches.js` | **0** ✅ | **0** ✅ |
| `link.js` | **1** (`flushSync`) ❌ | Yes ❌ |
| Hooks (`useParams`, etc.) | **0** ✅ | **0** ✅ |
| `router.js` | **0** ✅ | Guarded checks only |

**Only `Link` needed replacement.** Everything else works on React Native as-is.

## License

MIT

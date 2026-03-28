# RFC: Universal Todo App — 100% Shared Codebase

**Status:** In Progress  
**Date:** 2026-03-14  
**Goal:** Build a real-world Todo app with **one codebase, zero platform-specific code** — runs on React Native (iOS/Android) and Web from the exact same files.

---

## ✅ Step 1: `uniwind-router` — BUILT

We built `packages/uniwind-router` — a standalone package that makes TanStack Router work on both React Native and Web.

### How it works

The package re-exports all TanStack Router primitives, with **one key swap**: the `Link` component.

| Platform | `Link` renders as | How resolved |
| --- | --- | --- |
| **Web** (Vite) | `<a>` tag via TanStack Router | `"import"` condition in `package.json` |
| **React Native** (Metro) | `Pressable` + `router.navigate()` | `"react-native"` condition in `package.json` |

Everything else (`RouterProvider`, `useParams`, `useNavigate`, `Outlet`, etc.) is re-exported directly from `@tanstack/react-router` — they have **zero `react-dom` dependencies**.

### Key technical finding

After auditing `@tanstack/react-router`'s compiled source:

| File | `react-dom` imports | Works on RN? |
| --- | --- | --- |
| `RouterProvider.js` | **0** | ✅ Yes |
| `Matches.js` | **0** | ✅ Yes |
| All hooks (`useParams`, etc.) | **0** | ✅ Yes |
| `link.js` | **1** (`flushSync`) | ❌ No — replaced |

**Only `Link` needed a native replacement.** The rest of TanStack Router is already universal.

### Package structure

```
packages/uniwind-router/
├── src/
│   ├── index.web.ts           # Web entry — re-exports TSR + web Link
│   ├── index.native.ts        # Native entry — re-exports TSR + native Link
│   ├── web/
│   │   └── Link.tsx           # Re-export of @tanstack/react-router Link
│   ├── native/
│   │   └── Link.tsx           # Pressable + useRouter().navigate()
│   └── shared/
│       ├── types.ts           # UniversalLinkProps
│       └── history.ts         # createUniversalHistory() — auto-detect platform
├── dist/                      # Built output (ESM + CJS)
├── package.json               # Conditional exports
├── build.config.ts            # unbuild config
└── tsconfig.json
```

---

## Step 2: Todo App (Next)

With `uniwind-router` built, the todo app screens can be **100% shared**:

### Architecture

```
apps/todo-universal/
├── src/
│   ├── routes.ts                      # Route tree (100% shared)
│   ├── App.tsx                        # RouterProvider (100% shared)
│   ├── features/
│   │   └── todo/
│   │       ├── types.ts               # Todo, TodoFilter
│   │       ├── TodoContext.tsx         # State management
│   │       └── components/
│   │           ├── TodoItem.tsx        # With <Link> from uniwind-router
│   │           ├── TodoInput.tsx       # Add todo input
│   │           └── TodoFilter.tsx      # All/Active/Completed
│   └── screens/
│       ├── TodoListScreen.tsx          # List (100% shared)
│       └── TodoDetailScreen.tsx        # Detail — useParams() (100% shared)
├── native/                            # Native entry (minimal)
│   └── index.js                       # AppRegistry + createMemoryHistory
├── web/                               # Web entry (minimal)
│   └── index.tsx                      # createBrowserHistory + ReactDOM
├── styles/
│   └── global.css
└── package.json
```

### What's shared vs platform-specific

| File | Shared? | Why |
| --- | --- | --- |
| `routes.ts` | ✅ 100% | Uses `createRoute`/`createRouter` from `uniwind-router` |
| `App.tsx` | ✅ 100% | Uses `RouterProvider`/`Outlet` from `uniwind-router` |
| All screens | ✅ 100% | Uses `useParams`/`Link` from `uniwind-router` |
| All components | ✅ 100% | Uses `View`/`Text`/etc from `uniwind/components` |
| `TodoContext.tsx` | ✅ 100% | Pure React context |
| `native/index.js` | ❌ ~5 lines | `AppRegistry` + `createMemoryHistory` |
| `web/index.tsx` | ❌ ~5 lines | `ReactDOM` + `createBrowserHistory` |

**Result: ~99% shared.** Only 2 entry files (~5 lines each) are platform-specific.

### Example: TodoItem.tsx (100% shared)

```tsx
import { View, Text, Pressable } from 'uniwind/components'
import { Link } from 'uniwind-router'
import type { Todo } from '../types'

export function TodoItem({ todo, onToggle }: { todo: Todo; onToggle: (id: string) => void }) {
    return (
        <Link to="/todo/$id" params={{ id: todo.id }}>
            <View className="flex-row items-center px-6 py-4 border-b border-foreground/5">
                <Pressable
                    className="w-6 h-6 rounded-full border-2 border-accent mr-4 items-center justify-center"
                    onPress={() => onToggle(todo.id)}
                >
                    {todo.completed && <View className="w-3 h-3 rounded-full bg-accent" />}
                </Pressable>
                <Text className={`text-base flex-1 ${todo.completed ? 'text-muted line-through' : 'text-foreground'}`}>
                    {todo.text}
                </Text>
                <Text className="text-muted text-lg ml-2">›</Text>
            </View>
        </Link>
    )
}
```

### Example: TodoDetailScreen.tsx (100% shared)

```tsx
import { View, Text, TextInput, Pressable, ScrollView } from 'uniwind/components'
import { useParams, Link, useNavigate } from 'uniwind-router'
import { useTodos } from '../features/todo/TodoContext'

export function TodoDetailScreen() {
    const { id } = useParams({ from: '/todo/$id' })
    const navigate = useNavigate()
    const { getTodo, toggleTodo, deleteTodo, updateTodo } = useTodos()
    const todo = getTodo(id)

    if (!todo) {
        return (
            <View className="flex-1 bg-background justify-center items-center">
                <Text className="text-muted text-lg">Todo not found</Text>
                <Link to="/"><Text className="text-accent mt-4">← Go back</Text></Link>
            </View>
        )
    }

    return (
        <ScrollView className="flex-1 bg-background">
            <View className="px-6 pt-16 pb-4">
                <Link to="/"><Text className="text-accent font-medium">← Back</Text></Link>
            </View>
            <View className="px-6 pb-6">
                <Text className="text-2xl font-bold text-foreground">{todo.text}</Text>
            </View>
            <View className="px-6 gap-3 pb-8">
                <Pressable
                    className="bg-accent px-6 py-3 rounded-xl items-center"
                    onPress={() => toggleTodo(id)}
                >
                    <Text className="text-white font-semibold">
                        {todo.completed ? 'Mark Active' : 'Mark Completed'}
                    </Text>
                </Pressable>
                <Pressable
                    className="bg-red-500/10 px-6 py-3 rounded-xl items-center"
                    onPress={() => { deleteTodo(id); navigate({ to: '/' }) }}
                >
                    <Text className="text-red-500 font-semibold">Delete Todo</Text>
                </Pressable>
            </View>
        </ScrollView>
    )
}
```

---

## Effort Estimate

| Phase | Hours | Status |
| --- | --- | --- |
| Research (TanStack Router RN compatibility) | 2 | ✅ Done |
| Build `uniwind-router` package | 1 | ✅ Done |
| Todo app: shared code (types, context, screens) | 2 | ⬜ Next |
| Todo app: web entry (Vite/TanStack Start) | 1 | ⬜ |
| Todo app: native entry (Metro) | 1 | ⬜ |
| Testing & polish | 1 | ⬜ |
| **Total** | **~8h** | |

---

## Risks

| Risk | Likelihood | Mitigation |
| --- | --- | --- |
| `RouterProvider` crashes on RN due to hidden DOM dep | Low | Audited source — 0 deps found |
| `router.js` calls `window.addEventListener('popstate')` | Medium | Memory history doesn't use popstate |
| Native Link loses TanStack Router's type-safe `to` props | Medium | Can add generics later via `createLink()` |
| No native screen transitions (memory router = instant swap) | Expected | Acceptable for demo; bridge `react-native-screens` later |
| `@tanstack/history` imports browser APIs at module level | Low | `createMemoryHistory` is self-contained |

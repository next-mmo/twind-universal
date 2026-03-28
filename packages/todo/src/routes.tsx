/**
 * Shared route definitions for the Todo app.
 *
 * Both the bare (React Native) and web apps import from here
 * so the route tree, root layout, and screen mappings are
 * defined once — zero drift between platforms.
 */
import { createRootRoute, createRoute, Outlet } from 'uniwind-router'
import { TodoProvider } from './features/todo/TodoContext'
import { TodoDetailScreen } from './screens/TodoDetailScreen'
import { TodoListScreen } from './screens/TodoListScreen'

// ── Root layout (wraps every screen) ──────────────────────────────────
export const rootRoute = createRootRoute({
    component: () => (
        <TodoProvider>
            <Outlet />
        </TodoProvider>
    ),
})

// ── Screen routes ─────────────────────────────────────────────────────
export const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: TodoListScreen,
})

export const todoDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/todo/$id',
    component: TodoDetailScreen,
})

// ── Assembled route tree ──────────────────────────────────────────────
export const routeTree = rootRoute.addChildren([indexRoute, todoDetailRoute])

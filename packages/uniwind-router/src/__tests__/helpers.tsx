/**
 * Test helpers — utilities for creating test routers and rendering
 * components within a TanStack Router context.
 */
import {
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
    Outlet,
    RouterProvider,
} from '@tanstack/react-router'
import React from 'react'

export interface TestRouterOptions {
    /** Initial path. Default: '/' */
    initialPath?: string
    /** Additional routes to register */
    routes?: Array<{ path: string; component?: React.ComponentType }>
}

function DefaultComponent() {
    return React.createElement('div', { 'data-testid': 'default' }, 'Default')
}

function RootComponent() {
    return React.createElement('div', null, React.createElement(Outlet))
}

export function createTestRouter(options: TestRouterOptions = {}) {
    const { initialPath = '/', routes = [] } = options

    const rootRoute = createRootRoute({
        component: RootComponent,
    })

    const indexRoute = createRoute({
        getParentRoute: () => rootRoute,
        path: '/',
        component: DefaultComponent,
    })

    const additionalRoutes = routes.map((r) =>
        createRoute({
            getParentRoute: () => rootRoute,
            path: r.path,
            component: r.component ?? DefaultComponent,
        }),
    )

    const routeTree = rootRoute.addChildren([indexRoute, ...additionalRoutes])

    const history = createMemoryHistory({
        initialEntries: [initialPath],
    })

    const router = createRouter({
        routeTree,
        history,
    })

    return router
}

export function createTestRouterElement(options: TestRouterOptions = {}) {
    const router = createTestRouter(options)
    const element = React.createElement(RouterProvider, { router } as any)
    return { router, element }
}

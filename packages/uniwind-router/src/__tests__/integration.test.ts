/**
 * Integration tests — verifies the full router lifecycle:
 * navigation, history, and utility interactions working together.
 */
import { describe, expect, it, vi } from 'vitest'
import {
    createMemoryHistory,
    createRootRoute,
    createRoute,
    createRouter,
} from '@tanstack/react-router'
import { createUniversalHistory, detectHistoryType } from '../shared/history'
import { stripPrefixes } from '../native/DeepLinkProvider'
import { isTabActive } from '../native/TabBar'
import { detectDirection } from '../shared/useNavigationDirection'

describe('router lifecycle integration', () => {
    function buildRouter(initialPath = '/') {
        const rootRoute = createRootRoute({})
        const indexRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: '/',
        })
        const todoRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: '/todo',
        })
        const todoDetailRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: '/todo/$id',
        })
        const settingsRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: '/settings',
        })

        const routeTree = rootRoute.addChildren([
            indexRoute,
            todoRoute,
            todoDetailRoute,
            settingsRoute,
        ])

        const history = createMemoryHistory({ initialEntries: [initialPath] })

        return createRouter({ routeTree, history })
    }

    it('navigates forward and tracks path', async () => {
        const router = buildRouter('/')
        await router.load()

        expect(router.state.location.pathname).toBe('/')

        await router.navigate({ to: '/todo' } as any)
        expect(router.state.location.pathname).toBe('/todo')

        await router.navigate({ to: '/settings' } as any)
        expect(router.state.location.pathname).toBe('/settings')
    })

    it('navigates with params', async () => {
        const router = buildRouter('/')
        await router.load()

        await router.navigate({ to: '/todo/$id', params: { id: '42' } } as any)
        expect(router.state.location.pathname).toBe('/todo/42')
    })

    it('history.back() returns to previous route', async () => {
        const router = buildRouter('/')
        await router.load()

        await router.navigate({ to: '/todo' } as any)
        await router.navigate({ to: '/settings' } as any)
        expect(router.state.location.pathname).toBe('/settings')

        router.history.back()
        // Memory history back is synchronous
        expect(router.history.location.pathname).toBe('/todo')
    })

    it('canGoBack returns correct state', async () => {
        const router = buildRouter('/')
        await router.load()

        // At initial entry — can't go back
        expect(router.history.canGoBack()).toBe(false)

        await router.navigate({ to: '/todo' } as any)
        expect(router.history.canGoBack()).toBe(true)
    })

    it('replace navigation does not add to history', async () => {
        const router = buildRouter('/')
        await router.load()

        await router.navigate({ to: '/todo' } as any)
        expect(router.history.canGoBack()).toBe(true)

        // Replace current entry
        await router.navigate({ to: '/settings', replace: true } as any)
        expect(router.state.location.pathname).toBe('/settings')

        // Going back should go to '/', not '/todo'
        router.history.back()
        expect(router.history.location.pathname).toBe('/')
    })
})

describe('deep link → tab active → direction pipeline', () => {
    it('deep link strips prefix, tab matches route, direction detects forward', () => {
        // 1. Deep link arrives
        const url = 'myapp://todo/42'
        const path = stripPrefixes(url, ['myapp://'])
        expect(path).toBe('/todo/42')

        // 2. Tab bar checks active state
        expect(isTabActive(path, '/todo')).toBe(true)
        expect(isTabActive(path, '/')).toBe(false)
        expect(isTabActive(path, '/settings')).toBe(false)

        // 3. Direction detection
        expect(detectDirection(0, 1)).toBe('forward')
    })

    it('handles back navigation detection after deep link', () => {
        // User deep-linked to /todo/42 (index 1), then goes back (index 0)
        expect(detectDirection(1, 0)).toBe('back')

        // Now at root, tab bar should show home active
        expect(isTabActive('/', '/')).toBe(true)
        expect(isTabActive('/', '/todo')).toBe(false)
    })
})

describe('universal history with router', () => {
    it('memory history works with router navigate', async () => {
        const history = createUniversalHistory({
            type: 'memory',
            initialEntries: ['/'],
        })

        const rootRoute = createRootRoute({})
        const indexRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: '/',
        })
        const aboutRoute = createRoute({
            getParentRoute: () => rootRoute,
            path: '/about',
        })

        const routeTree = rootRoute.addChildren([indexRoute, aboutRoute])
        const router = createRouter({ routeTree, history })
        await router.load()

        expect(router.state.location.pathname).toBe('/')

        await router.navigate({ to: '/about' } as any)
        expect(router.state.location.pathname).toBe('/about')
    })
})

describe('edge cases', () => {
    it('stripPrefixes handles empty string', () => {
        const path = stripPrefixes('', [])
        expect(path).toBe('/')
    })

    it('isTabActive handles empty paths', () => {
        expect(isTabActive('', '')).toBe(true)
        expect(isTabActive('', '/')).toBe(false)
    })

    it('detectDirection handles zero indices', () => {
        expect(detectDirection(0, 0)).toBe('replace')
    })

    it('multiple sequential navigations maintain correct state', async () => {
        const rootRoute = createRootRoute({})
        const routes = ['/', '/a', '/b', '/c', '/d'].map((path) =>
            createRoute({
                getParentRoute: () => rootRoute,
                path,
            }),
        )

        const routeTree = rootRoute.addChildren(routes)
        const history = createMemoryHistory({ initialEntries: ['/'] })
        const router = createRouter({ routeTree, history })
        await router.load()

        const paths = ['/a', '/b', '/c', '/d']
        for (const p of paths) {
            await router.navigate({ to: p } as any)
            expect(router.state.location.pathname).toBe(p)
        }

        // Now go back through all
        for (let i = paths.length - 2; i >= 0; i--) {
            router.history.back()
            expect(router.history.location.pathname).toBe(paths[i])
        }

        // One more back should be root
        router.history.back()
        expect(router.history.location.pathname).toBe('/')
    })
})

/**
 * Export verification tests — ensures every public API symbol
 * is properly exported from the native entry point.
 *
 * These are "smoke tests" that catch accidental export regressions.
 */
import { describe, expect, it } from 'vitest'

// Import everything from the native entry
import * as nativeExports from '../index.native'

describe('native entry exports', () => {
    // ── TanStack Router re-exports ───────────────────────────────
    const tanstackReExports = [
        'createBrowserHistory',
        'createHashHistory',
        'createLink',
        'createMemoryHistory',
        'createRootRoute',
        'createRootRouteWithContext',
        'createRoute',
        'createRouter',
        'getRouteApi',
        'isNotFound',
        'isRedirect',
        'notFound',
        'Outlet',
        'RouterProvider',
        'retainSearchParams',
        'redirect',
        'stripSearchParams',
        'useCanGoBack',
        'useLoaderData',
        'useLoaderDeps',
        'useLocation',
        'useMatch',
        'useMatchRoute',
        'useNavigate',
        'useParams',
        'useRouteContext',
        'useRouter',
        'useRouterState',
        'useSearch',
    ]

    it.each(tanstackReExports)('exports TanStack Router: %s', (name) => {
        expect((nativeExports as any)[name]).toBeDefined()
    })

    // ── Native-specific components ───────────────────────────────
    const nativeComponents = [
        'Link',
        'AnimatedOutlet',
        'TabBar',
        'DrawerLayout',
        'GestureBack',
        'ScreenStack',
        'DeepLinkProvider',
    ]

    it.each(nativeComponents)('exports native component: %s', (name) => {
        expect((nativeExports as any)[name]).toBeDefined()
        expect(typeof (nativeExports as any)[name]).toBe('function')
    })

    // ── Hooks ────────────────────────────────────────────────────
    const hooks = [
        'useBackHandler',
        'useDrawer',
        'useFocusEffect',
        'useIsFocused',
        'useNavigationDirection',
    ]

    it.each(hooks)('exports hook: %s', (name) => {
        expect((nativeExports as any)[name]).toBeDefined()
        expect(typeof (nativeExports as any)[name]).toBe('function')
    })

    // ── Utility functions ────────────────────────────────────────
    const utilities = [
        'createUniversalHistory',
        'stripPrefixes',
        'isTabActive',
        'detectDirection',
    ]

    it.each(utilities)('exports utility: %s', (name) => {
        expect((nativeExports as any)[name]).toBeDefined()
        expect(typeof (nativeExports as any)[name]).toBe('function')
    })
})

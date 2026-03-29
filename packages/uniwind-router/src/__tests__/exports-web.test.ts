/**
 * Web export verification tests.
 */
import { describe, expect, it } from 'vitest'
import * as webExports from '../index.web'

describe('web entry exports', () => {
    const tanstackReExports = [
        'createBrowserHistory',
        'createFileRoute',
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
        expect((webExports as any)[name]).toBeDefined()
    })

    const webComponents = ['Link', 'AnimatedOutlet']

    it.each(webComponents)('exports web component: %s', (name) => {
        expect((webExports as any)[name]).toBeDefined()
    })

    const hooks = ['useDrawer', 'useFocusEffect', 'useIsFocused', 'useNavigationDirection']

    it.each(hooks)('exports hook: %s', (name) => {
        expect((webExports as any)[name]).toBeDefined()
        expect(typeof (webExports as any)[name]).toBe('function')
    })

    const utilities = ['createUniversalHistory', 'detectDirection']

    it.each(utilities)('exports utility: %s', (name) => {
        expect((webExports as any)[name]).toBeDefined()
        expect(typeof (webExports as any)[name]).toBe('function')
    })

    it('does NOT export native-only features on web', () => {
        expect((webExports as any).useBackHandler).toBeUndefined()
        expect((webExports as any).DeepLinkProvider).toBeUndefined()
        expect((webExports as any).GestureBack).toBeUndefined()
        expect((webExports as any).ScreenStack).toBeUndefined()
        expect((webExports as any).TabBar).toBeUndefined()
        expect((webExports as any).DrawerLayout).toBeUndefined()
    })
})

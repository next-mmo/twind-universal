/**
 * uniwind-router — Web entry point
 *
 * Re-exports TanStack Router with web-optimized Link (renders <a> tags).
 * This entry is resolved by Vite / TanStack Start / any web bundler.
 */

export type {
    AnyRoute,
    AnyRouter,
    LinkOptions,
    NavigateOptions,
    RegisteredRouter,
} from '@tanstack/react-router'

// ── Core TanStack Router (all platform-agnostic) ──────────────────────
export {
    createBrowserHistory,
    createFileRoute,
    createHashHistory,
    createLink,
    createMemoryHistory,
    createRootRoute,
    createRootRouteWithContext,
    createRoute,
    createRouter,
    getRouteApi,
    isNotFound,
    isRedirect,
    notFound,
    Outlet,
    RouterProvider,
    retainSearchParams,
    redirect,
    stripSearchParams,
    useCanGoBack,
    useLoaderData,
    useLoaderDeps,
    useLocation,
    useMatch,
    useMatchRoute,
    useNavigate,
    useParams,
    useRouteContext,
    useRouter,
    useRouterState,
    useSearch,
} from '@tanstack/react-router'

// ── Web Link (renders <a> tag) ────────────────────────────────────────
export { Link } from './web/Link'

// ── Web AnimatedOutlet (CSS transitions) ──────────────────────────────
export { AnimatedOutlet } from './web/AnimatedOutlet'

// ── Universal hooks ───────────────────────────────────────────────────
export { useFocusEffect, useIsFocused } from './shared/useFocusEffect'
export { useNavigationDirection, detectDirection } from './shared/useNavigationDirection'

// ── Drawer context (usable on web too) ────────────────────────────────
export { useDrawer } from './shared/drawerContext'

// ── Universal history helper ──────────────────────────────────────────
export { createUniversalHistory } from './shared/history'

// ── Types ─────────────────────────────────────────────────────────────
export type {
    AnimatedOutletProps,
    DeepLinkProviderProps,
    DrawerContextValue,
    DrawerItem,
    DrawerLayoutProps,
    GestureBackProps,
    NavigationDirection,
    ScreenStackProps,
    TabBarProps,
    TabItem,
    TransitionPreset,
    UniversalLinkProps,
} from './shared/types'

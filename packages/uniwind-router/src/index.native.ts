/**
 * uniwind-router — Native entry point (React Native)
 *
 * Re-exports TanStack Router with native-optimized components.
 * This entry is resolved by Metro via the "react-native" conditional export.
 *
 * Important: RouterProvider and Matches from @tanstack/react-router have
 * ZERO react-dom dependencies — they work on React Native as-is!
 * Only `Link` needed a native replacement (Pressable instead of <a>).
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

// ── Native Link (renders Pressable + router.navigate) ─────────────────
export { Link } from './native/Link'

// ── Animated Outlet (Reanimated entering/exiting) ─────────────────────
export { AnimatedOutlet } from './native/AnimatedOutlet'

// ── Android Back Handler ──────────────────────────────────────────────
export { useBackHandler } from './native/useBackHandler'
export type { UseBackHandlerOptions } from './native/useBackHandler'

// ── Deep Linking ──────────────────────────────────────────────────────
export { DeepLinkProvider, stripPrefixes } from './native/DeepLinkProvider'

// ── Tab Navigator ─────────────────────────────────────────────────────
export { TabBar, isTabActive } from './native/TabBar'

// ── Drawer Navigator ──────────────────────────────────────────────────
export { DrawerLayout } from './native/DrawerLayout'
export { useDrawer } from './shared/drawerContext'

// ── Gesture Back (swipe-from-edge) ────────────────────────────────────
export { GestureBack } from './native/GestureBack'

// ── Screen Stack (keep-alive transitions) ─────────────────────────────
export { ScreenStack } from './native/ScreenStack'

// ── Universal hooks ───────────────────────────────────────────────────
export { useFocusEffect, useIsFocused } from './shared/useFocusEffect'
export { useNavigationDirection, detectDirection } from './shared/useNavigationDirection'

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

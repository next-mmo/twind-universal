/**
 * uniwind-router — Native entry point (React Native)
 *
 * Re-exports TanStack Router with native-optimized Link (renders Pressable).
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
    // History
    createMemoryHistory,
    createRootRoute,
    createRootRouteWithContext,
    createRoute,
    // Router creation
    createRouter,
    isNotFound,
    isRedirect,
    notFound,
    Outlet,
    // Route provider — works on native! No react-dom deps.
    RouterProvider,
    // Navigation utilities
    redirect,
    useLocation,
    useMatch,
    useNavigate,
    // Hooks (all pure React — no DOM deps)
    useParams,
    useRouter,
    useRouterState,
    useSearch,
} from '@tanstack/react-router'
// ── Native Link (renders Pressable + router.navigate) ─────────────────
export { Link } from './native/Link'
// ── Universal history helper ──────────────────────────────────────────
export { createUniversalHistory } from './shared/history'
// ── Types ─────────────────────────────────────────────────────────────
export type { UniversalLinkProps } from './shared/types'

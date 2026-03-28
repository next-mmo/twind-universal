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
    // File route utilities (for TanStack Start)
    createFileRoute,
    createHashHistory,
    createLink,
    // Memory history (useful for testing on web too)
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
    // Route provider
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

// ── Universal history helper ──────────────────────────────────────────
export { createUniversalHistory } from './shared/history'

// ── Types ─────────────────────────────────────────────────────────────
export type { UniversalLinkProps } from './shared/types'
// ── Web Link (renders <a> tag) ────────────────────────────────────────
export { Link } from './web/Link'

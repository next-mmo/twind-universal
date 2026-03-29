import type { ReactNode } from 'react'

/**
 * Universal Link props that work on both native and web.
 *
 * On web: renders as `<a>` tag via TanStack Router's Link
 * On native: renders as Pressable with onPress → router.navigate()
 */
export interface UniversalLinkProps {
    /** Route path to navigate to, e.g. '/todo/$id' */
    to: string
    /** Route params, e.g. { id: '123' } */
    params?: Record<string, string>
    /** Search params */
    search?: Record<string, unknown>
    /** Replace current history entry instead of pushing */
    replace?: boolean
    /** Children to render inside the link */
    children: ReactNode
    /** Optional className for styling (works via uniwind) */
    className?: string
    /** Called when link is pressed */
    onPress?: () => void
    /** Disable the link */
    disabled?: boolean
    /** Test ID for testing */
    testID?: string
}

// ── Animation types ──────────────────────────────────────────────────

export type TransitionPreset = 'slide' | 'fade' | 'none'
export type NavigationDirection = 'forward' | 'back' | 'replace'

export interface AnimatedOutletProps {
    /** Transition preset. Default: 'slide' */
    transition?: TransitionPreset
    /** Animation duration in ms. Default: 250 */
    duration?: number
    /** Children override (defaults to matched route component) */
    children?: ReactNode
}

// ── Tab types ────────────────────────────────────────────────────────

export interface TabItem {
    /** Route path, e.g. '/' or '/settings' */
    to: string
    /** Tab label text */
    label: string
    /** Optional icon render function */
    icon?: (props: { focused: boolean; color: string; size: number }) => ReactNode
    /** Search params to pass when navigating */
    search?: Record<string, unknown>
    /** Test ID for testing */
    testID?: string
}

export interface TabBarProps {
    /** Array of tab definitions */
    tabs: TabItem[]
    /** Active tab color. Default: '#6366f1' (indigo-500) */
    activeColor?: string
    /** Inactive tab color. Default: '#a1a1aa' (zinc-400) */
    inactiveColor?: string
    /** Background color. Default: '#ffffff' */
    backgroundColor?: string
    /** Tab bar height. Default: 56 */
    height?: number
    /** Bottom padding (safe area). Default: 0 */
    bottomInset?: number
    /** Optional className for the container */
    className?: string
}

// ── Drawer types ─────────────────────────────────────────────────────

export interface DrawerItem {
    /** Route path */
    to: string
    /** Drawer item label */
    label: string
    /** Optional icon */
    icon?: (props: { focused: boolean; color: string; size: number }) => ReactNode
    /** Search params */
    search?: Record<string, unknown>
}

export interface DrawerLayoutProps {
    /** Drawer menu items */
    items: DrawerItem[]
    /** Drawer width. Default: 280 */
    drawerWidth?: number
    /** Content to render (typically an Outlet or AnimatedOutlet) */
    children: ReactNode
    /** Active item color. Default: '#6366f1' */
    activeColor?: string
    /** Inactive item color. Default: '#71717a' */
    inactiveColor?: string
    /** Edge swipe region width for gesture. Default: 30 */
    edgeWidth?: number
}

// ── Deep link types ──────────────────────────────────────────────────

export interface DeepLinkProviderProps {
    /** URL prefixes to strip, e.g. ['myapp://', 'https://myapp.com'] */
    prefixes: string[]
    /** Children to render */
    children: ReactNode
    /** Called when a deep link is resolved */
    onDeepLink?: (path: string) => void
}

// ── Gesture back types ───────────────────────────────────────────────

export interface GestureBackProps {
    /** Children to wrap with gesture detection */
    children: ReactNode
    /** Enable/disable gesture. Default: true */
    enabled?: boolean
    /** Edge region width where gesture activates. Default: 30 */
    edgeWidth?: number
    /** Min swipe distance to trigger back. Default: 80 */
    minDistance?: number
}

// ── Screen stack types ───────────────────────────────────────────────

export interface ScreenStackProps {
    /** Max number of screens to keep mounted. Default: 5 */
    maxStack?: number
    /** Transition preset. Default: 'slide' */
    transition?: TransitionPreset
    /** Animation duration in ms. Default: 250 */
    duration?: number
}

// ── Drawer context ───────────────────────────────────────────────────

export interface DrawerContextValue {
    isOpen: boolean
    open: () => void
    close: () => void
    toggle: () => void
}

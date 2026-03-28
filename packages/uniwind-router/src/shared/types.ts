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

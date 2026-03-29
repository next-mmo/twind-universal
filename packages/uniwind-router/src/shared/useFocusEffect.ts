/**
 * useFocusEffect — fires a callback when the current route matches.
 *
 * Analogous to React Navigation's useFocusEffect, but powered by
 * TanStack Router's subscription system. Works on both web and native.
 *
 * The callback fires:
 *   - On mount if the route is already active
 *   - When navigating TO this route
 *   - Cleanup fires when navigating AWAY from this route
 */
import { useRouter, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'

export function useFocusEffect(callback: () => void | (() => void), routePath?: string) {
    const router = useRouter()
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname
    const cleanupRef = useRef<void | (() => void)>(undefined)
    const wasFocusedRef = useRef(false)

    // Determine if the target route is currently focused
    const targetPath = routePath ?? currentPath
    const isFocused = currentPath === targetPath || (routePath === undefined)

    useEffect(() => {
        if (isFocused && !wasFocusedRef.current) {
            // Route just became focused — run callback
            cleanupRef.current = callback()
            wasFocusedRef.current = true
        } else if (!isFocused && wasFocusedRef.current) {
            // Route lost focus — run cleanup
            if (typeof cleanupRef.current === 'function') {
                cleanupRef.current()
            }
            cleanupRef.current = undefined
            wasFocusedRef.current = false
        }

        return () => {
            // Component unmounting — run cleanup
            if (typeof cleanupRef.current === 'function') {
                cleanupRef.current()
            }
        }
    }, [isFocused, callback])

    return isFocused
}

/**
 * useIsFocused — returns whether the current route is active.
 *
 * Useful for conditionally rendering or subscribing to updates
 * only when the screen is visible.
 */
export function useIsFocused(routePath?: string): boolean {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    if (routePath === undefined) {
        return true // always focused if no specific path given
    }

    return currentPath === routePath
}

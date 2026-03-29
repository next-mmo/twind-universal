/**
 * useNavigationDirection — tracks whether the latest navigation was
 * forward, back, or replace.
 *
 * Uses TanStack Router's history index to determine direction.
 * Works on both web (browser history) and native (memory history).
 */
import { useRouter, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import type { NavigationDirection } from './types'

export function useNavigationDirection(): NavigationDirection {
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname
    const prevPathRef = useRef(currentPath)
    const prevIndexRef = useRef(0)
    const directionRef = useRef<NavigationDirection>('forward')

    // Use the router's history state index if available
    const router = useRouter()
    const currentIndex = (router.history.location.state as any)?.__TSR_index ?? 0

    useEffect(() => {
        if (currentPath !== prevPathRef.current) {
            if (currentIndex > prevIndexRef.current) {
                directionRef.current = 'forward'
            } else if (currentIndex < prevIndexRef.current) {
                directionRef.current = 'back'
            } else {
                directionRef.current = 'replace'
            }
            prevPathRef.current = currentPath
            prevIndexRef.current = currentIndex
        }
    }, [currentPath, currentIndex])

    return directionRef.current
}

/**
 * Standalone direction detector that works outside of React components.
 * Useful for configuring animations before render.
 */
export function detectDirection(prevIndex: number, currentIndex: number): NavigationDirection {
    if (currentIndex > prevIndex) return 'forward'
    if (currentIndex < prevIndex) return 'back'
    return 'replace'
}

/**
 * AnimatedOutlet — a drop-in replacement for TanStack Router's <Outlet />
 * that animates screen transitions using react-native-reanimated.
 *
 * Features:
 *   - Directional awareness (slide left on forward, slide right on back)
 *   - Configurable presets: 'slide', 'fade', 'none'
 *   - Uses Reanimated layout animations (runs on native UI thread = 60fps)
 *   - key={pathname} triggers mount/unmount → entering/exiting animations
 */
import { Outlet, useRouterState } from '@tanstack/react-router'
import React, { useEffect, useRef } from 'react'
import { StyleSheet } from 'react-native'
import Animated, {
    FadeIn,
    FadeOut,
    SlideInLeft,
    SlideInRight,
    SlideOutLeft,
    SlideOutRight,
} from 'react-native-reanimated'
import type { AnimatedOutletProps, NavigationDirection } from '../shared/types'

export function AnimatedOutlet({
    transition = 'slide',
    duration = 250,
    children,
}: AnimatedOutletProps) {
    const routerState = useRouterState()
    const pathname = routerState.location.pathname
    const prevPathnameRef = useRef(pathname)
    const directionRef = useRef<NavigationDirection>('forward')
    const historyIndexRef = useRef(0)

    // Track navigation direction by comparing sequential pathnames
    useEffect(() => {
        if (pathname !== prevPathnameRef.current) {
            // Use a simple heuristic: if we've seen this path before, it's likely "back"
            // More robust: compare with router history state if available
            const currentIndex = (routerState.location.state as any)?.__TSR_index ?? historyIndexRef.current
            const prevIndex = historyIndexRef.current

            if (currentIndex > prevIndex) {
                directionRef.current = 'forward'
            } else if (currentIndex < prevIndex) {
                directionRef.current = 'back'
            } else {
                directionRef.current = 'forward' // default to forward on replace
            }

            historyIndexRef.current = currentIndex
            prevPathnameRef.current = pathname
        }
    }, [pathname, routerState.location.state])

    if (transition === 'none') {
        return children ?? <Outlet />
    }

    const { entering, exiting } = getAnimations(transition, directionRef.current, duration)

    return (
        <Animated.View
            key={pathname}
            entering={entering}
            exiting={exiting}
            style={styles.container}
        >
            {children ?? <Outlet />}
        </Animated.View>
    )
}

function getAnimations(preset: 'slide' | 'fade', direction: NavigationDirection, duration: number) {
    if (preset === 'fade') {
        return {
            entering: FadeIn.duration(duration),
            exiting: FadeOut.duration(duration),
        }
    }

    // Slide preset — direction-aware
    if (direction === 'back') {
        return {
            entering: SlideInLeft.duration(duration),
            exiting: SlideOutRight.duration(duration),
        }
    }

    return {
        entering: SlideInRight.duration(duration),
        exiting: SlideOutLeft.duration(duration),
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

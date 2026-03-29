/**
 * ScreenStack — keeps previously visited screens mounted (but hidden) so
 * exit animations can play and back navigation feels instant.
 *
 * Features:
 *   - Configurable max stack depth (default: 5)
 *   - Only the top screen is interactive (others have pointerEvents='none')
 *   - Reanimated entering/exiting animations per screen
 *   - Automatic cleanup of oldest screens when max depth exceeded
 *   - Direction-aware animations (slide right on back, slide left on forward)
 */
import { Outlet, useRouterState } from '@tanstack/react-router'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Animated, {
    FadeIn,
    FadeOut,
    SlideInLeft,
    SlideInRight,
    SlideOutLeft,
    SlideOutRight,
} from 'react-native-reanimated'
import type { NavigationDirection, ScreenStackProps } from '../shared/types'

interface StackEntry {
    pathname: string
    key: string
}

export function ScreenStack({
    maxStack = 5,
    transition = 'slide',
    duration = 250,
}: ScreenStackProps) {
    const routerState = useRouterState()
    const pathname = routerState.location.pathname
    const [stack, setStack] = useState<StackEntry[]>([
        { pathname, key: `${pathname}-${Date.now()}` },
    ])
    const prevPathnameRef = useRef(pathname)
    const directionRef = useRef<NavigationDirection>('forward')

    useEffect(() => {
        if (pathname === prevPathnameRef.current) return

        // Detect direction: if pathname exists in stack, it's a back navigation
        const existingIndex = stack.findIndex((e) => e.pathname === pathname)
        const isBack = existingIndex >= 0 && existingIndex < stack.length - 1

        directionRef.current = isBack ? 'back' : 'forward'

        setStack((prev) => {
            if (isBack) {
                // Pop entries above the target
                return prev.slice(0, existingIndex + 1)
            }

            // Push new entry
            const newEntry: StackEntry = {
                pathname,
                key: `${pathname}-${Date.now()}`,
            }
            const newStack = [...prev, newEntry]

            // Trim oldest if exceeding max
            if (newStack.length > maxStack) {
                return newStack.slice(newStack.length - maxStack)
            }

            return newStack
        })

        prevPathnameRef.current = pathname
    }, [pathname, maxStack])

    const topEntry = stack[stack.length - 1]

    return (
        <View style={styles.container}>
            {stack.map((entry, index) => {
                const isTop = entry.key === topEntry?.key
                const { entering, exiting } = getStackAnimations(
                    transition,
                    directionRef.current,
                    duration,
                )

                return (
                    <Animated.View
                        key={entry.key}
                        entering={isTop ? entering : undefined}
                        exiting={!isTop ? exiting : undefined}
                        style={[
                            styles.screen,
                            !isTop && styles.hiddenScreen,
                        ]}
                        pointerEvents={isTop ? 'auto' : 'none'}
                    >
                        {isTop ? <Outlet /> : null}
                    </Animated.View>
                )
            })}
        </View>
    )
}

function getStackAnimations(
    preset: 'slide' | 'fade' | 'none',
    direction: NavigationDirection,
    duration: number,
) {
    if (preset === 'none' || preset === undefined) {
        return { entering: undefined, exiting: undefined }
    }

    if (preset === 'fade') {
        return {
            entering: FadeIn.duration(duration),
            exiting: FadeOut.duration(duration),
        }
    }

    // Slide
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
    screen: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#fff',
    },
    hiddenScreen: {
        opacity: 0,
    },
})

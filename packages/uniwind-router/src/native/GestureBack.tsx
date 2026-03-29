/**
 * GestureBack — wraps children with a pan gesture detector that triggers
 * router.history.back() on a right swipe from the left edge.
 *
 * Features:
 *   - Edge-only activation (configurable width)
 *   - Minimum distance threshold to prevent accidental triggers
 *   - Runs animation on UI thread via Reanimated worklets
 *   - Spring-back on cancelled gesture
 *   - Only activates when router can go back
 */
import { useRouter } from '@tanstack/react-router'
import React from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import type { GestureBackProps } from '../shared/types'

const SCREEN_WIDTH = Dimensions.get('window').width

const SPRING_BACK = {
    damping: 20,
    stiffness: 300,
    mass: 0.5,
}

export function GestureBack({
    children,
    enabled = true,
    edgeWidth = 30,
    minDistance = 80,
}: GestureBackProps) {
    const router = useRouter()
    const translateX = useSharedValue(0)
    const startX = useSharedValue(0)

    const goBack = () => {
        if (router.history.canGoBack()) {
            router.history.back()
        }
    }

    const panGesture = Gesture.Pan()
        .enabled(enabled)
        .activeOffsetX(10) // Only activate on horizontal movement
        .failOffsetY([-20, 20]) // Fail on vertical movement
        .onStart((e) => {
            startX.value = e.x
        })
        .onUpdate((e) => {
            // Only respond if gesture started in the edge zone
            if (startX.value > edgeWidth) return

            // Only allow positive (rightward) translation
            const tx = Math.max(0, e.translationX)
            translateX.value = tx
        })
        .onEnd((e) => {
            // Gesture started outside edge — ignore
            if (startX.value > edgeWidth) return

            if (e.translationX > minDistance && e.velocityX > 0) {
                // Swipe completed — animate off screen then go back
                translateX.value = withSpring(SCREEN_WIDTH, SPRING_BACK, () => {
                    runOnJS(goBack)()
                    translateX.value = 0
                })
            } else {
                // Cancelled — spring back
                translateX.value = withSpring(0, SPRING_BACK)
            }
        })

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }))

    if (!enabled) {
        return <>{children}</>
    }

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.container, animatedStyle]}>
                {children}
            </Animated.View>
        </GestureDetector>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})

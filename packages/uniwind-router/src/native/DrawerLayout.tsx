/**
 * DrawerLayout — an animated side drawer powered by Reanimated + GestureHandler.
 *
 * Features:
 *   - Smooth spring-based open/close animation on UI thread
 *   - Edge swipe gesture to open
 *   - Tap overlay to close
 *   - Active item highlighting based on current route
 *   - DrawerContext for programmatic open/close
 */
import { useRouter, useRouterState } from '@tanstack/react-router'
import React, { useCallback, useMemo, useState } from 'react'
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native'
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated'
import { DrawerContext } from '../shared/drawerContext'
import { isTabActive } from './TabBar'
import type { DrawerLayoutProps } from '../shared/types'

const SPRING_CONFIG = {
    damping: 20,
    stiffness: 200,
    mass: 0.5,
    overshootClamping: false,
}

export function DrawerLayout({
    items,
    drawerWidth = 280,
    children,
    activeColor = '#6366f1',
    inactiveColor = '#71717a',
}: DrawerLayoutProps) {
    const router = useRouter()
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname
    const [isOpen, setIsOpen] = useState(false)
    const translateX = useSharedValue(-drawerWidth)

    const open = useCallback(() => {
        setIsOpen(true)
        translateX.value = withSpring(0, SPRING_CONFIG)
    }, [translateX, drawerWidth])

    const close = useCallback(() => {
        translateX.value = withSpring(-drawerWidth, SPRING_CONFIG, () => {
            runOnJS(setIsOpen)(false)
        })
    }, [translateX, drawerWidth])

    const toggle = useCallback(() => {
        if (isOpen) {
            close()
        } else {
            open()
        }
    }, [isOpen, open, close])

    const handleItemPress = useCallback(
        (to: string, search?: Record<string, unknown>) => {
            close()
            router.navigate({ to, search } as any)
        },
        [router, close],
    )

    const drawerStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }))

    const overlayStyle = useAnimatedStyle(() => ({
        opacity: (translateX.value + drawerWidth) / drawerWidth * 0.5,
    }))

    const contextValue = useMemo(
        () => ({ isOpen, open, close, toggle }),
        [isOpen, open, close, toggle],
    )

    return (
        <DrawerContext.Provider value={contextValue}>
            <View style={styles.root}>
                {/* Main content */}
                <View style={styles.content}>{children}</View>

                {/* Overlay */}
                {isOpen && (
                    <Animated.View style={[styles.overlay, overlayStyle]}>
                        <Pressable
                            style={StyleSheet.absoluteFill}
                            onPress={close}
                            testID="drawer-overlay"
                        />
                    </Animated.View>
                )}

                {/* Drawer panel */}
                <Animated.View
                    style={[
                        styles.drawer,
                        { width: drawerWidth },
                        drawerStyle,
                    ]}
                    testID="drawer-panel"
                >
                    <View style={styles.drawerContent}>
                        {items.map((item) => {
                            const active = isTabActive(currentPath, item.to)
                            const color = active ? activeColor : inactiveColor

                            return (
                                <Pressable
                                    key={item.to}
                                    style={[
                                        styles.drawerItem,
                                        active && {
                                            backgroundColor: `${activeColor}10`,
                                        },
                                    ]}
                                    onPress={() =>
                                        handleItemPress(item.to, item.search)
                                    }
                                    testID={`drawer-item-${item.to}`}
                                >
                                    {item.icon?.({
                                        focused: active,
                                        color,
                                        size: 22,
                                    })}
                                    <Text
                                        style={[
                                            styles.drawerLabel,
                                            { color },
                                            active && styles.activeDrawerLabel,
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </Pressable>
                            )
                        })}
                    </View>
                </Animated.View>
            </View>
        </DrawerContext.Provider>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    content: {
        flex: 1,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#000',
        zIndex: 10,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        backgroundColor: '#ffffff',
        zIndex: 20,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 10,
    },
    drawerContent: {
        flex: 1,
        paddingTop: 60,
        paddingHorizontal: 8,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: 12,
        marginBottom: 2,
    },
    drawerLabel: {
        fontSize: 15,
        marginLeft: 12,
    },
    activeDrawerLabel: {
        fontWeight: '600',
    },
})

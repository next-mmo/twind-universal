/**
 * TabBar — a tab navigator that uses TanStack Router for navigation.
 *
 * Renders a horizontal bar of pressable tabs. Highlights the active tab
 * based on the current route. Calls router.navigate() on press.
 *
 * This is a presentation component — it doesn't own routes or screens.
 * Use it alongside <Outlet /> or <AnimatedOutlet /> for content.
 */
import { useRouter, useRouterState } from '@tanstack/react-router'
import React, { useCallback } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type { TabBarProps, TabItem } from '../shared/types'

export function TabBar({
    tabs,
    activeColor = '#6366f1',
    inactiveColor = '#a1a1aa',
    backgroundColor = '#ffffff',
    height = 56,
    bottomInset = 0,
    className,
}: TabBarProps) {
    const router = useRouter()
    const routerState = useRouterState()
    const currentPath = routerState.location.pathname

    const handlePress = useCallback(
        (tab: TabItem) => {
            router.navigate({
                to: tab.to,
                search: tab.search as any,
            } as any)
        },
        [router],
    )

    return (
        <View
            style={[
                styles.container,
                {
                    backgroundColor,
                    height: height + bottomInset,
                    paddingBottom: bottomInset,
                },
            ]}
            testID="tab-bar"
        >
            {tabs.map((tab) => {
                const isActive = isTabActive(currentPath, tab.to)
                const color = isActive ? activeColor : inactiveColor

                return (
                    <Pressable
                        key={tab.to}
                        style={styles.tab}
                        onPress={() => handlePress(tab)}
                        testID={tab.testID ?? `tab-${tab.to}`}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: isActive }}
                    >
                        {tab.icon?.({ focused: isActive, color, size: 24 })}
                        <Text
                            style={[
                                styles.label,
                                { color },
                                isActive && styles.activeLabel,
                            ]}
                            numberOfLines={1}
                        >
                            {tab.label}
                        </Text>
                    </Pressable>
                )
            })}
        </View>
    )
}

/**
 * Determine if a tab is active based on the current path.
 * Root '/' matches exactly. Other paths use startsWith for nested routes.
 */
export function isTabActive(currentPath: string, tabPath: string): boolean {
    if (tabPath === '/') {
        return currentPath === '/'
    }
    return currentPath === tabPath || currentPath.startsWith(`${tabPath}/`)
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: '#e4e4e7',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
    },
    label: {
        fontSize: 11,
        marginTop: 2,
    },
    activeLabel: {
        fontWeight: '600',
    },
})

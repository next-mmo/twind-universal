/**
 * Native Link — renders a Pressable that navigates via TanStack Router.
 *
 * On React Native, there are no `<a>` tags. This component wraps a
 * Pressable from `uniwind/components` (so className works) and calls
 * `router.navigate()` on press.
 *
 * This file is resolved via the "react-native" condition in package.json.
 */
import { useRouter } from '@tanstack/react-router'
import React, { useCallback } from 'react'
import { Pressable, View } from 'react-native'
import type { UniversalLinkProps } from '../shared/types'

export function Link({ to, params, search, replace, children, className, onPress, disabled, testID }: UniversalLinkProps) {
    const router = useRouter()

    const handlePress = useCallback(() => {
        if (disabled) return

        onPress?.()

        router.navigate({
            to,
            params: params as any,
            search: search as any,
            replace,
        })
    }, [router, to, params, search, replace, disabled, onPress])

    return (
        <Pressable onPress={handlePress} disabled={disabled} testID={testID} accessibilityRole="link">
            {typeof children === 'string' ? (
                <View>
                    <>{children}</>
                </View>
            ) : (
                children
            )}
        </Pressable>
    )
}

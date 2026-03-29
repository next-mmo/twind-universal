/**
 * useBackHandler — wires Android's hardware back button to TanStack Router.
 *
 * On press:
 *   1. If a custom handler is provided and returns true, stop.
 *   2. If router.history can go back, go back.
 *   3. Otherwise, let the system handle it (exit app).
 *
 * On iOS this is a no-op (iOS has no hardware back button).
 */
import { useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'
import { BackHandler, Platform } from 'react-native'

export interface UseBackHandlerOptions {
    /** Custom handler. Return true to prevent default back behavior. */
    onBack?: () => boolean
    /** Enable/disable. Default: true */
    enabled?: boolean
}

export function useBackHandler(options: UseBackHandlerOptions = {}) {
    const { onBack, enabled = true } = options
    const router = useRouter()

    useEffect(() => {
        if (Platform.OS !== 'android' || !enabled) {
            return
        }

        const handler = () => {
            // Custom handler takes priority
            if (onBack?.()) {
                return true
            }

            // Try going back via router history
            if (router.history.canGoBack()) {
                router.history.back()
                return true
            }

            // Let system handle (exit app)
            return false
        }

        const subscription = BackHandler.addEventListener('hardwareBackPress', handler)

        return () => {
            subscription.remove()
        }
    }, [router, onBack, enabled])
}

/**
 * DeepLinkProvider — bridges React Native's Linking API to TanStack Router.
 *
 * Handles:
 *   - Initial URL on app launch (cold start deep link)
 *   - Incoming URLs while app is running (warm deep link)
 *   - URL prefix stripping (e.g. 'myapp://' → '/')
 *
 * Usage:
 *   <DeepLinkProvider prefixes={['myapp://', 'https://myapp.com']}>
 *     <RouterProvider router={router} />
 *   </DeepLinkProvider>
 */
import { useRouter } from '@tanstack/react-router'
import React, { useEffect } from 'react'
import { Linking } from 'react-native'
import type { DeepLinkProviderProps } from '../shared/types'

/**
 * Strip known prefixes from a deep link URL to extract the route path.
 *
 * Examples:
 *   stripPrefixes('myapp://todo/123', ['myapp://']) → '/todo/123'
 *   stripPrefixes('https://app.com/settings', ['https://app.com']) → '/settings'
 *   stripPrefixes('/already/clean', ['myapp://']) → '/already/clean'
 */
export function stripPrefixes(url: string, prefixes: string[]): string {
    for (const prefix of prefixes) {
        if (url.startsWith(prefix)) {
            const path = url.slice(prefix.length)
            return path.startsWith('/') ? path : `/${path}`
        }
    }

    // If no prefix matched, try to parse as URL
    try {
        const parsed = new URL(url)
        return parsed.pathname + parsed.search + parsed.hash
    } catch {
        // Already a path
        return url.startsWith('/') ? url : `/${url}`
    }
}

export function DeepLinkProvider({ prefixes, children, onDeepLink }: DeepLinkProviderProps) {
    return (
        <>
            <DeepLinkHandler prefixes={prefixes} onDeepLink={onDeepLink} />
            {children}
        </>
    )
}

/**
 * Internal component that must be rendered inside RouterProvider
 * to access the router context.
 */
function DeepLinkHandler({
    prefixes,
    onDeepLink,
}: {
    prefixes: string[]
    onDeepLink?: (path: string) => void
}) {
    const router = useRouter()

    useEffect(() => {
        const handleUrl = (url: string | null) => {
            if (!url) return

            const path = stripPrefixes(url, prefixes)
            onDeepLink?.(path)

            router.navigate({
                to: path,
            } as any)
        }

        // Handle initial URL (cold start)
        Linking.getInitialURL().then(handleUrl)

        // Handle incoming URLs (warm start)
        const subscription = Linking.addEventListener('url', (event) => {
            handleUrl(event.url)
        })

        return () => {
            subscription.remove()
        }
    }, [router, prefixes, onDeepLink])

    return null
}

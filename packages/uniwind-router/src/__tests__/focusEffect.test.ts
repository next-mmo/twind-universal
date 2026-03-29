import { render, act } from '@testing-library/react'
import React from 'react'
import { RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { describe, expect, it, vi } from 'vitest'
import { useFocusEffect, useIsFocused } from '../shared/useFocusEffect'

interface CapturedValues {
    isFocused?: boolean
    focusEffectResult?: boolean
}

function buildApp(options: {
    initialPath?: string
    captureRef: React.MutableRefObject<CapturedValues>
    hookSetup: (capture: CapturedValues) => void
}) {
    const { initialPath = '/', captureRef, hookSetup } = options

    function IndexPage() {
        hookSetup(captureRef.current)
        return React.createElement('div', null, 'Index')
    }

    const root = createRootRoute({ component: () => React.createElement(Outlet) })
    const index = createRoute({ getParentRoute: () => root, path: '/', component: IndexPage })
    const pageA = createRoute({ getParentRoute: () => root, path: '/page-a', component: () => React.createElement('div', null, 'A') })
    const tree = root.addChildren([index, pageA])
    const router = createRouter({ routeTree: tree, history: createMemoryHistory({ initialEntries: [initialPath] }) })

    return { router, element: React.createElement(RouterProvider, { router } as any) }
}

describe('useIsFocused', () => {
    it('returns true when no routePath specified', async () => {
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: (c) => { c.isFocused = useIsFocused() },
        })

        await act(async () => { render(element) })
        expect(ref.current.isFocused).toBe(true)
    })

    it('returns true when current path matches routePath', async () => {
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: (c) => { c.isFocused = useIsFocused('/') },
        })

        await act(async () => { render(element) })
        expect(ref.current.isFocused).toBe(true)
    })

    it('returns false when current path does not match', async () => {
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: (c) => { c.isFocused = useIsFocused('/page-a') },
        })

        await act(async () => { render(element) })
        expect(ref.current.isFocused).toBe(false)
    })
})

describe('useFocusEffect', () => {
    it('calls callback when route is focused (no path)', async () => {
        const callback = vi.fn()
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: () => { useFocusEffect(callback) },
        })

        await act(async () => { render(element) })
        expect(callback).toHaveBeenCalled()
    })

    it('does not call callback when watching different route', async () => {
        const callback = vi.fn()
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: () => { useFocusEffect(callback, '/page-a') },
        })

        await act(async () => { render(element) })
        expect(callback).not.toHaveBeenCalled()
    })

    it('runs cleanup on unmount', async () => {
        const cleanup = vi.fn()
        const callback = vi.fn().mockReturnValue(cleanup)
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: () => { useFocusEffect(callback) },
        })

        let unmount: () => void
        await act(async () => {
            const result = render(element)
            unmount = result.unmount
        })

        expect(callback).toHaveBeenCalled()

        await act(async () => { unmount!() })
        expect(cleanup).toHaveBeenCalled()
    })

    it('returns isFocused=true when watching current route', async () => {
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: (c) => { c.focusEffectResult = useFocusEffect(vi.fn(), '/') },
        })

        await act(async () => { render(element) })
        expect(ref.current.focusEffectResult).toBe(true)
    })

    it('returns isFocused=false when watching other route', async () => {
        const ref = { current: {} as CapturedValues }
        const { element } = buildApp({
            captureRef: ref,
            hookSetup: (c) => { c.focusEffectResult = useFocusEffect(vi.fn(), '/page-a') },
        })

        await act(async () => { render(element) })
        expect(ref.current.focusEffectResult).toBe(false)
    })
})

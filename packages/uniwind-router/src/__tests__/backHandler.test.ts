import { render, act } from '@testing-library/react'
import React from 'react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { BackHandler, Platform } from 'react-native'
import { RouterProvider, createMemoryHistory, createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import { useBackHandler } from '../native/useBackHandler'

function buildApp(hookOptions?: Parameters<typeof useBackHandler>[0], initialPath = '/') {
    // Hook must be called inside a route component
    function IndexPage() {
        useBackHandler(hookOptions)
        return React.createElement('div', { 'data-testid': 'index' }, 'Index')
    }

    function PageA() {
        useBackHandler(hookOptions)
        return React.createElement('div', { 'data-testid': 'page-a' }, 'Page A')
    }

    const root = createRootRoute({ component: () => React.createElement(Outlet) })
    const index = createRoute({ getParentRoute: () => root, path: '/', component: IndexPage })
    const pageA = createRoute({ getParentRoute: () => root, path: '/page-a', component: PageA })
    const tree = root.addChildren([index, pageA])
    const router = createRouter({ routeTree: tree, history: createMemoryHistory({ initialEntries: [initialPath] }) })

    return { router, element: React.createElement(RouterProvider, { router } as any) }
}

describe('useBackHandler', () => {
    beforeEach(() => {
        ;(Platform as any).OS = 'android'
        vi.mocked(BackHandler.addEventListener).mockClear()
    })

    it('registers BackHandler listener on Android', async () => {
        const { element } = buildApp()

        await act(async () => { render(element) })

        expect(BackHandler.addEventListener).toHaveBeenCalledWith(
            'hardwareBackPress', expect.any(Function),
        )
    })

    it('does not register on iOS', async () => {
        ;(Platform as any).OS = 'ios'
        const { element } = buildApp()

        await act(async () => { render(element) })

        expect(BackHandler.addEventListener).not.toHaveBeenCalled()
    })

    it('does not register when enabled=false', async () => {
        const { element } = buildApp({ enabled: false })

        await act(async () => { render(element) })

        expect(BackHandler.addEventListener).not.toHaveBeenCalled()
    })

    it('custom onBack returning true prevents default', async () => {
        const onBack = vi.fn().mockReturnValue(true)
        const { element } = buildApp({ onBack })

        await act(async () => { render(element) })

        const handler = vi.mocked(BackHandler.addEventListener).mock.calls
            .find(c => c[0] === 'hardwareBackPress')?.[1]

        expect(handler).toBeDefined()
        const result = handler!()
        expect(onBack).toHaveBeenCalled()
        expect(result).toBe(true)
    })

    it('returns false at initial entry when cannot go back', async () => {
        const { element } = buildApp()

        await act(async () => { render(element) })

        const handler = vi.mocked(BackHandler.addEventListener).mock.calls
            .find(c => c[0] === 'hardwareBackPress')?.[1]

        expect(handler).toBeDefined()
        const result = handler!()
        expect(result).toBe(false)
    })

    it('goes back via router when can go back', async () => {
        const { router, element } = buildApp()

        await act(async () => { render(element) })
        await act(async () => { await router.navigate({ to: '/page-a' } as any) })

        const handler = vi.mocked(BackHandler.addEventListener).mock.calls
            .find(c => c[0] === 'hardwareBackPress')?.[1]

        const result = handler!()
        expect(result).toBe(true)
        expect(router.history.location.pathname).toBe('/')
    })
})

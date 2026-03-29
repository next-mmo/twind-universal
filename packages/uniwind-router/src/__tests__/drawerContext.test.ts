import { renderHook, act } from '@testing-library/react'
import React, { useState, useCallback } from 'react'
import { describe, expect, it } from 'vitest'
import { DrawerContext, useDrawer } from '../shared/drawerContext'

function createDrawerWrapper() {
    return function DrawerTestProvider({ children }: { children: React.ReactNode }) {
        const [isOpen, setIsOpen] = useState(false)
        const open = useCallback(() => setIsOpen(true), [])
        const close = useCallback(() => setIsOpen(false), [])
        const toggle = useCallback(() => setIsOpen((v) => !v), [])

        return React.createElement(
            DrawerContext.Provider,
            { value: { isOpen, open, close, toggle } },
            children,
        )
    }
}

describe('useDrawer', () => {
    it('returns default context values when no provider', () => {
        const { result } = renderHook(() => useDrawer())
        expect(result.current.isOpen).toBe(false)
        expect(typeof result.current.open).toBe('function')
        expect(typeof result.current.close).toBe('function')
        expect(typeof result.current.toggle).toBe('function')
    })

    it('opens the drawer', () => {
        const Wrapper = createDrawerWrapper()
        const { result } = renderHook(() => useDrawer(), { wrapper: Wrapper })

        expect(result.current.isOpen).toBe(false)

        act(() => {
            result.current.open()
        })

        expect(result.current.isOpen).toBe(true)
    })

    it('closes the drawer', () => {
        const Wrapper = createDrawerWrapper()
        const { result } = renderHook(() => useDrawer(), { wrapper: Wrapper })

        act(() => {
            result.current.open()
        })
        expect(result.current.isOpen).toBe(true)

        act(() => {
            result.current.close()
        })
        expect(result.current.isOpen).toBe(false)
    })

    it('toggles the drawer', () => {
        const Wrapper = createDrawerWrapper()
        const { result } = renderHook(() => useDrawer(), { wrapper: Wrapper })

        act(() => {
            result.current.toggle()
        })
        expect(result.current.isOpen).toBe(true)

        act(() => {
            result.current.toggle()
        })
        expect(result.current.isOpen).toBe(false)
    })

    it('toggle → open → close sequence works', () => {
        const Wrapper = createDrawerWrapper()
        const { result } = renderHook(() => useDrawer(), { wrapper: Wrapper })

        act(() => result.current.toggle())
        expect(result.current.isOpen).toBe(true)

        act(() => result.current.open())
        expect(result.current.isOpen).toBe(true) // still open

        act(() => result.current.close())
        expect(result.current.isOpen).toBe(false)
    })
})

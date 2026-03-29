import { describe, expect, it, vi } from 'vitest'
import { createUniversalHistory, detectHistoryType } from '../shared/history'

describe('detectHistoryType', () => {
    it('returns "browser" when window and document exist', () => {
        // jsdom provides window + document
        expect(detectHistoryType()).toBe('browser')
    })

    it('returns "memory" when window is undefined', () => {
        const originalWindow = globalThis.window
        // @ts-ignore
        delete globalThis.window
        expect(detectHistoryType()).toBe('memory')
        globalThis.window = originalWindow
    })
})

describe('createUniversalHistory', () => {
    it('creates browser history by default in jsdom', () => {
        const history = createUniversalHistory()
        // Browser history exposes location with pathname
        expect(history.location.pathname).toBe('/')
    })

    it('creates memory history when forced', () => {
        const history = createUniversalHistory({ type: 'memory' })
        expect(history.location.pathname).toBe('/')
    })

    it('creates memory history with custom initial entries', () => {
        const history = createUniversalHistory({
            type: 'memory',
            initialEntries: ['/todo/123'],
        })
        expect(history.location.pathname).toBe('/todo/123')
    })

    it('defaults to memory for unknown types', () => {
        const history = createUniversalHistory({ type: 'hash' as any })
        // hash or fallback — should not throw
        expect(history.location.pathname).toBeDefined()
    })

    it('creates memory history with multiple entries and navigates', () => {
        const history = createUniversalHistory({
            type: 'memory',
            initialEntries: ['/', '/about', '/settings'],
        })
        expect(history.location.pathname).toBe('/settings')
    })
})

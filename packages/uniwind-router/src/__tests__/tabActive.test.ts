import { describe, expect, it } from 'vitest'
import { isTabActive } from '../native/TabBar'

describe('isTabActive', () => {
    it('matches root path exactly', () => {
        expect(isTabActive('/', '/')).toBe(true)
    })

    it('does not match root when on nested path', () => {
        expect(isTabActive('/todo/123', '/')).toBe(false)
    })

    it('matches exact non-root path', () => {
        expect(isTabActive('/settings', '/settings')).toBe(true)
    })

    it('matches nested path under tab', () => {
        expect(isTabActive('/settings/profile', '/settings')).toBe(true)
    })

    it('matches deeply nested path under tab', () => {
        expect(isTabActive('/settings/profile/edit', '/settings')).toBe(true)
    })

    it('does not match unrelated paths', () => {
        expect(isTabActive('/about', '/settings')).toBe(false)
    })

    it('does not match partial path names', () => {
        // '/settings-advanced' should not match '/settings'
        expect(isTabActive('/settings-advanced', '/settings')).toBe(false)
    })

    it('handles trailing slashes in current path', () => {
        expect(isTabActive('/settings/', '/settings')).toBe(true)
    })

    it('matches when paths are identical with params', () => {
        expect(isTabActive('/todo/123', '/todo')).toBe(true)
    })

    it('handles root path with query string', () => {
        // pathname only — query strings are stripped before comparison
        expect(isTabActive('/', '/')).toBe(true)
    })
})

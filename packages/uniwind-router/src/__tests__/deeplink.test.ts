import { describe, expect, it } from 'vitest'
import { stripPrefixes } from '../native/DeepLinkProvider'

describe('stripPrefixes', () => {
    const prefixes = ['myapp://', 'https://myapp.com', 'https://www.myapp.com/']

    it('strips a custom scheme prefix', () => {
        expect(stripPrefixes('myapp://todo/123', prefixes)).toBe('/todo/123')
    })

    it('strips an https prefix', () => {
        expect(stripPrefixes('https://myapp.com/settings', prefixes)).toBe('/settings')
    })

    it('strips prefix with trailing slash', () => {
        expect(stripPrefixes('https://www.myapp.com/about', prefixes)).toBe('/about')
    })

    it('handles root path after prefix', () => {
        expect(stripPrefixes('myapp://', prefixes)).toBe('/')
    })

    it('handles empty path after prefix', () => {
        expect(stripPrefixes('myapp://', prefixes)).toBe('/')
    })

    it('adds leading slash if missing', () => {
        expect(stripPrefixes('myapp://home', prefixes)).toBe('/home')
    })

    it('preserves existing leading slash', () => {
        expect(stripPrefixes('myapp:///home', prefixes)).toBe('/home')
    })

    it('passes through already-clean paths', () => {
        expect(stripPrefixes('/already/clean', prefixes)).toBe('/already/clean')
    })

    it('falls back to URL parsing for unknown prefixes', () => {
        expect(stripPrefixes('https://other.com/path?q=1', prefixes)).toBe('/path?q=1')
    })

    it('handles bare paths without scheme', () => {
        expect(stripPrefixes('todo/123', [])).toBe('/todo/123')
    })

    it('handles paths that start with slash and no matching prefix', () => {
        expect(stripPrefixes('/users/me', prefixes)).toBe('/users/me')
    })

    it('matches first prefix when multiple could match', () => {
        const result = stripPrefixes('myapp://home', ['myapp://', 'myapp://home'])
        expect(result).toBe('/home')
    })

    it('handles URLs with query params after prefix', () => {
        expect(stripPrefixes('myapp://search?q=hello&page=2', prefixes)).toBe('/search?q=hello&page=2')
    })

    it('handles URLs with hash after prefix', () => {
        expect(stripPrefixes('myapp://docs#section', prefixes)).toBe('/docs#section')
    })
})

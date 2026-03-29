import { describe, expect, it } from 'vitest'
import { detectDirection } from '../shared/useNavigationDirection'

describe('detectDirection', () => {
    it('returns "forward" when current index is greater', () => {
        expect(detectDirection(0, 1)).toBe('forward')
        expect(detectDirection(2, 5)).toBe('forward')
    })

    it('returns "back" when current index is smaller', () => {
        expect(detectDirection(3, 1)).toBe('back')
        expect(detectDirection(5, 0)).toBe('back')
    })

    it('returns "replace" when indices are equal', () => {
        expect(detectDirection(2, 2)).toBe('replace')
        expect(detectDirection(0, 0)).toBe('replace')
    })

    it('handles edge case of negative indices', () => {
        expect(detectDirection(-1, 0)).toBe('forward')
        expect(detectDirection(0, -1)).toBe('back')
    })
})

/**
 * Test setup — mocks for React Native, Reanimated, Gesture Handler.
 */
import { vi, afterEach } from 'vitest'

// ── Polyfill missing jsdom APIs ──────────────────────────────────────
window.scrollTo = vi.fn()

// ── Mock React Native ────────────────────────────────────────────────
vi.mock('react-native', () => ({
    Platform: { OS: 'android', select: (obj: any) => obj.android ?? obj.default },
    StyleSheet: {
        create: (styles: any) => styles,
        absoluteFillObject: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
        hairlineWidth: 0.5,
    },
    Pressable: 'Pressable',
    Text: 'Text',
    View: 'View',
    Dimensions: { get: () => ({ width: 390, height: 844 }) },
    BackHandler: {
        addEventListener: vi.fn((_event: string, _handler: () => boolean) => ({
            remove: vi.fn(),
        })),
    },
    Linking: {
        getInitialURL: vi.fn().mockResolvedValue(null),
        addEventListener: vi.fn(() => ({ remove: vi.fn() })),
    },
}))

// ── Mock Reanimated ──────────────────────────────────────────────────
vi.mock('react-native-reanimated', () => {
    const React = require('react')
    const MockAnimatedView = React.forwardRef((props: any, ref: any) => {
        const { entering, exiting, layout, ...rest } = props
        return React.createElement('animated-view', { ...rest, ref })
    })
    MockAnimatedView.displayName = 'Animated.View'

    const anim = (name: string) => {
        const a: any = { duration: () => a, delay: () => a, springify: () => a, damping: () => a, mass: () => a, stiffness: () => a, overshootClamping: () => a, build: () => ({}), __name: name }
        return a
    }
    return {
        default: { View: MockAnimatedView, Text: 'animated-text', createAnimatedComponent: (c: any) => c },
        useSharedValue: (initial: any) => ({ value: initial }),
        useAnimatedStyle: (fn: () => any) => fn(),
        withSpring: vi.fn((v: number, _c?: any, cb?: Function) => { cb?.(true); return v }),
        withTiming: vi.fn((v: number, _c?: any, cb?: Function) => { cb?.(true); return v }),
        runOnJS: (fn: Function) => fn,
        FadeIn: anim('FadeIn'), FadeOut: anim('FadeOut'),
        SlideInLeft: anim('SlideInLeft'), SlideInRight: anim('SlideInRight'),
        SlideOutLeft: anim('SlideOutLeft'), SlideOutRight: anim('SlideOutRight'),
    }
})

// ── Mock Gesture Handler ─────────────────────────────────────────────
vi.mock('react-native-gesture-handler', () => {
    const React = require('react')
    const g: any = { enabled: () => g, activeOffsetX: () => g, failOffsetY: () => g, onStart: () => g, onUpdate: () => g, onEnd: () => g }
    return {
        Gesture: { Pan: () => ({ ...g }), Tap: () => ({ ...g }) },
        GestureDetector: ({ children }: any) => React.createElement('gesture-detector', null, children),
    }
})

// No global afterEach — each test file handles its own cleanup

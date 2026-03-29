import { describe, expect, it } from 'vitest'
import type {
    AnimatedOutletProps,
    DeepLinkProviderProps,
    DrawerContextValue,
    DrawerItem,
    DrawerLayoutProps,
    GestureBackProps,
    NavigationDirection,
    ScreenStackProps,
    TabBarProps,
    TabItem,
    TransitionPreset,
    UniversalLinkProps,
} from '../shared/types'

describe('types', () => {
    it('TransitionPreset has correct values', () => {
        const presets: TransitionPreset[] = ['slide', 'fade', 'none']
        expect(presets).toHaveLength(3)
    })

    it('NavigationDirection has correct values', () => {
        const directions: NavigationDirection[] = ['forward', 'back', 'replace']
        expect(directions).toHaveLength(3)
    })

    it('AnimatedOutletProps shape is valid', () => {
        const props: AnimatedOutletProps = {
            transition: 'slide',
            duration: 300,
        }
        expect(props.transition).toBe('slide')
        expect(props.duration).toBe(300)
    })

    it('AnimatedOutletProps allows no properties (all optional)', () => {
        const props: AnimatedOutletProps = {}
        expect(props).toBeDefined()
    })

    it('TabItem requires to and label', () => {
        const tab: TabItem = {
            to: '/home',
            label: 'Home',
        }
        expect(tab.to).toBe('/home')
        expect(tab.label).toBe('Home')
    })

    it('TabItem supports optional icon and search', () => {
        const tab: TabItem = {
            to: '/search',
            label: 'Search',
            search: { q: 'test' },
            testID: 'search-tab',
        }
        expect(tab.search).toEqual({ q: 'test' })
    })

    it('TabBarProps requires tabs array', () => {
        const props: TabBarProps = {
            tabs: [
                { to: '/', label: 'Home' },
                { to: '/settings', label: 'Settings' },
            ],
        }
        expect(props.tabs).toHaveLength(2)
    })

    it('TabBarProps supports all optional style props', () => {
        const props: TabBarProps = {
            tabs: [],
            activeColor: '#ff0000',
            inactiveColor: '#999',
            backgroundColor: '#fff',
            height: 64,
            bottomInset: 34,
            className: 'custom',
        }
        expect(props.height).toBe(64)
    })

    it('DrawerItem shape is valid', () => {
        const item: DrawerItem = {
            to: '/profile',
            label: 'Profile',
        }
        expect(item.to).toBe('/profile')
    })

    it('DrawerLayoutProps requires items and children', () => {
        const props: DrawerLayoutProps = {
            items: [{ to: '/', label: 'Home' }],
            children: null as any,
        }
        expect(props.items).toHaveLength(1)
    })

    it('DrawerContextValue shape is valid', () => {
        const ctx: DrawerContextValue = {
            isOpen: false,
            open: () => {},
            close: () => {},
            toggle: () => {},
        }
        expect(typeof ctx.toggle).toBe('function')
    })

    it('DeepLinkProviderProps requires prefixes and children', () => {
        const props: DeepLinkProviderProps = {
            prefixes: ['myapp://'],
            children: null as any,
        }
        expect(props.prefixes).toHaveLength(1)
    })

    it('GestureBackProps requires children', () => {
        const props: GestureBackProps = {
            children: null as any,
            enabled: true,
            edgeWidth: 30,
            minDistance: 80,
        }
        expect(props.enabled).toBe(true)
    })

    it('ScreenStackProps has all optional fields', () => {
        const props: ScreenStackProps = {
            maxStack: 10,
            transition: 'fade',
            duration: 300,
        }
        expect(props.maxStack).toBe(10)
    })

    it('UniversalLinkProps requires to and children', () => {
        const props: UniversalLinkProps = {
            to: '/test',
            children: null as any,
        }
        expect(props.to).toBe('/test')
    })

    it('UniversalLinkProps supports all optional fields', () => {
        const props: UniversalLinkProps = {
            to: '/test',
            params: { id: '1' },
            search: { q: 'hello' },
            replace: true,
            children: null as any,
            className: 'link',
            onPress: () => {},
            disabled: false,
            testID: 'link-test',
        }
        expect(props.replace).toBe(true)
        expect(props.params).toEqual({ id: '1' })
    })
})

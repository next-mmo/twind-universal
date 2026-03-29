/**
 * DrawerContext — shared context for controlling drawer open/close state.
 *
 * Used by DrawerLayout and consumed by any component that needs to
 * open/close the drawer programmatically (e.g. hamburger button).
 */
import { createContext, useContext } from 'react'
import type { DrawerContextValue } from './types'

export const DrawerContext = createContext<DrawerContextValue>({
    isOpen: false,
    open: () => {},
    close: () => {},
    toggle: () => {},
})

export function useDrawer(): DrawerContextValue {
    return useContext(DrawerContext)
}

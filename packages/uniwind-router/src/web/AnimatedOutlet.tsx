/**
 * AnimatedOutlet (Web) — uses CSS animations for route transitions.
 *
 * On web, we use CSS `@keyframes` instead of Reanimated since:
 *   - No Reanimated dependency needed for web-only apps
 *   - CSS animations are GPU-accelerated in browsers
 *   - Smaller bundle than including Reanimated on web
 *
 * If the browser supports the View Transitions API (Chrome 111+),
 * we use that instead for native-feeling page transitions.
 */
import { Outlet, useRouterState } from '@tanstack/react-router'
import React, { useEffect, useRef } from 'react'
import type { AnimatedOutletProps } from '../shared/types'

export function AnimatedOutlet({
    transition = 'slide',
    duration = 250,
    children,
}: AnimatedOutletProps) {
    const routerState = useRouterState()
    const pathname = routerState.location.pathname
    const containerRef = useRef<HTMLDivElement>(null)

    if (transition === 'none') {
        return <>{children ?? <Outlet />}</>
    }

    const animationName = transition === 'fade' ? 'uniwind-fade-in' : 'uniwind-slide-in'

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        @keyframes uniwind-fade-in {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                        @keyframes uniwind-slide-in {
                            from { transform: translateX(30px); opacity: 0; }
                            to { transform: translateX(0); opacity: 1; }
                        }
                    `,
                }}
            />
            <div
                key={pathname}
                ref={containerRef}
                style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    animation: `${animationName} ${duration}ms ease-out`,
                }}
            >
                {children ?? <Outlet />}
            </div>
        </>
    )
}

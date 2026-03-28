import { createRootRouteWithContext } from '@tanstack/react-router'
import type { TodoRouterContext } from './-router/context'
import { RootRouteShell } from './-shells/RootRouteShell'

export const Route = createRootRouteWithContext<TodoRouterContext>()({
    head: () => ({
        meta: [
            { charSet: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { title: 'Todo - Uniwind Universal' },
        ],
    }),
    component: RootRouteShell,
})

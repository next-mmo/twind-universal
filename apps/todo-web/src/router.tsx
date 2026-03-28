import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function getRouter() {
    const router = createRouter({
        context: {
            appName: 'todo-web',
            platform: 'web',
        },
        routeTree,
        scrollRestoration: true,
    })

    return router
}

declare module '@tanstack/react-router' {
    interface Register {
        router: ReturnType<typeof getRouter>
    }
}

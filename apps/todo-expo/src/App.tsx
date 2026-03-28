import './global.css'
import { routeTree } from '@todo/routes'
import { createMemoryHistory, createRouter, RouterProvider } from 'uniwind-router'

// Memory history for React Native (no browser URL bar)
const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
})

// Type registration
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export function App() {
    return <RouterProvider router={router} />
}

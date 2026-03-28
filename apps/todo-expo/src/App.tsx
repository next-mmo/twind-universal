import './global.css'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createMemoryHistory, createRouter, RouterProvider } from 'uniwind-router'
import { routeTree } from './routeTree.gen'

// Memory history for React Native (no browser URL bar)
const router = createRouter({
    context: {
        appName: 'todo-expo',
        platform: 'expo',
    },
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
    return (
        <SafeAreaProvider>
            <RouterProvider router={router} />
        </SafeAreaProvider>
    )
}

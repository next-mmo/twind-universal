import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createMemoryHistory, createRouter, RouterProvider } from 'uniwind-router'
import { routeTree } from './routeTree.gen'

const router = createRouter({
    context: {
        appName: 'todo-bare',
        platform: 'bare',
    },
    routeTree,
    history: createMemoryHistory({ initialEntries: ['/'] }),
})

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <RouterProvider router={router} />
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

import './global.css'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createMemoryHistory, createRouter, RouterProvider } from 'uniwind-router'
import { routeTree } from './routeTree.gen'

function NativeErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
    const message = error instanceof Error ? error.message : String(error)

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16, backgroundColor: '#111827' }}>
            <View style={{ gap: 8 }}>
                <Text style={{ color: '#f8fafc', fontSize: 24, fontWeight: '700' }}>Something went wrong</Text>
                <Text style={{ color: '#fca5a5', fontSize: 14, lineHeight: 20 }}>{message}</Text>
            </View>
            <Pressable
                onPress={reset}
                style={{ alignSelf: 'flex-start', backgroundColor: '#ffffff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 999 }}
            >
                <Text style={{ color: '#111827', fontWeight: '600' }}>Try again</Text>
            </Pressable>
        </ScrollView>
    )
}

function NativeNotFoundComponent() {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
            <Text style={{ color: '#f8fafc', fontSize: 24, fontWeight: '700' }}>Not Found</Text>
        </View>
    )
}

// Memory history for React Native (no browser URL bar)
const router = createRouter({
    context: {
        appName: 'todo-expo',
        platform: 'expo',
    },
    defaultErrorComponent: NativeErrorComponent,
    defaultNotFoundComponent: NativeNotFoundComponent,
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

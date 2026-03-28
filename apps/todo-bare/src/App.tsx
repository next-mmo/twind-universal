import './global.css'
import { Pressable, ScrollView, Text, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { createMemoryHistory, createRouter, RouterProvider } from 'uniwind-router'
import { routeTree } from './routeTree.gen'

function NativeRouterErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
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

const router = createRouter({
    context: {
        appName: 'todo-bare',
        platform: 'bare',
    },
    defaultErrorComponent: NativeRouterErrorComponent,
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

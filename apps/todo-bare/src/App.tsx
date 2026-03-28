import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { TodoProvider } from '@todo/features/todo/TodoContext'
import { TodoDetailScreen } from '@todo/screens/TodoDetailScreen'
import { TodoListScreen } from '@todo/screens/TodoListScreen'

type RootStackParamList = {
    TodoList: undefined
    TodoDetail: { id: string }
}

const Stack = createNativeStackNavigator<RootStackParamList>()

export function App() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <TodoProvider>
                    <NavigationContainer>
                        <Stack.Navigator screenOptions={{ headerShown: false }}>
                            <Stack.Screen name="TodoList" component={TodoListScreen} />
                            <Stack.Screen name="TodoDetail" component={TodoDetailScreen} />
                        </Stack.Navigator>
                    </NavigationContainer>
                </TodoProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    )
}

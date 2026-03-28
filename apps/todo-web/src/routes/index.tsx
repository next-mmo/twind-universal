import { createFileRoute } from '@tanstack/react-router'
import { TodoListScreen } from '@todo/screens/TodoListScreen'

export const Route = createFileRoute('/')({
    // react-native-web requires browser APIs, disable SSR for this route
    ssr: false,
    component: TodoListScreen,
})

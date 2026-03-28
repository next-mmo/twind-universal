import { createFileRoute } from '@tanstack/react-router'
import { TodoDetailScreen } from '@todo/screens/TodoDetailScreen'

export const Route = createFileRoute('/todo/$id')({
    // react-native-web requires browser APIs, disable SSR for this route
    ssr: false,
    component: TodoDetailScreen,
})

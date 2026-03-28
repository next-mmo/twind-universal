import { createFileRoute } from '@tanstack/react-router'
import { parseTodoDetailSearch, todoDetailSearchMiddlewares } from '../../-router/search'
import { TodoDetailView } from './-view'

export const Route = createFileRoute('/todo/$id')({
    ssr: false,
    validateSearch: search => parseTodoDetailSearch(search),
    search: {
        middlewares: todoDetailSearchMiddlewares as any,
    },
    component: TodoDetailView,
})

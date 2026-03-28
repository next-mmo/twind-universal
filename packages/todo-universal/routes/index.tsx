import { createFileRoute } from '@tanstack/react-router'
import { parseTodoListSearch, todoListSearchMiddlewares } from './-router/search'
import { TodoListView } from './-views/TodoListView'

export const Route = createFileRoute('/')({
    ssr: false,
    validateSearch: search => parseTodoListSearch(search),
    search: {
        middlewares: todoListSearchMiddlewares as any,
    },
    component: TodoListView,
})

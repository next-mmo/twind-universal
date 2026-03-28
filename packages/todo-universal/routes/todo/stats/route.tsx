import { createFileRoute } from '@tanstack/react-router'
import type { TodoRouterContext } from '../../-router/context'
import {
    buildTodoStatsLoaderData,
    buildTodoStatsRouteContext,
    createTodoStatsLoaderDeps,
    parseTodoStatsSearch,
    type TodoStatsLoaderDeps,
    type TodoStatsSearch,
    todoStatsSearchMiddlewares,
} from '../../-router/stats'
import { TodoStatsView } from './-view'

export const Route = createFileRoute('/todo/stats')({
    ssr: false,
    validateSearch: search => parseTodoStatsSearch(search),
    search: {
        middlewares: todoStatsSearchMiddlewares as any,
    },
    beforeLoad: ({ context, search }) => buildTodoStatsRouteContext(search as TodoStatsSearch, context as TodoRouterContext),
    loaderDeps: ({ search }) => createTodoStatsLoaderDeps(search as TodoStatsSearch),
    loader: ({ context, deps }) => buildTodoStatsLoaderData(deps as TodoStatsLoaderDeps, context as TodoRouterContext),
    component: TodoStatsView,
})

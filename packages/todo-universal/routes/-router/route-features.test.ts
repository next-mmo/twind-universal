import { describe, expect, it } from 'vitest'
import type { Todo } from '../-store/types'
import type { TodoRouterContext } from './context'
import {
    defaultTodoDetailSearch,
    defaultTodoListSearch,
    filterAndSortTodos,
    parseTodoDetailSearch,
    parseTodoListSearch,
    pickTodoListSearch,
    todoDetailSearchMiddlewares,
    todoListSearchMiddlewares,
} from './search'
import {
    buildTodoStatsLoaderData,
    buildTodoStatsRouteContext,
    createTodoStatsLoaderDeps,
    defaultTodoStatsSearch,
    parseTodoStatsSearch,
    todoStatsSearchMiddlewares,
} from './stats'

const sampleTodos: Todo[] = [
    { id: '1', text: 'Ship docs', completed: false, createdAt: 20, notes: 'write route notes' },
    { id: '2', text: 'Archive beta', completed: true, createdAt: 10 },
    { id: '3', text: 'Call Alex', completed: false, createdAt: 30 },
]

function applyMiddlewares(
    middlewares: Array<(ctx: { next: (search: unknown) => unknown; search: unknown }) => unknown>,
    currentSearch: unknown,
    finalNext: (search: unknown) => unknown,
) {
    const invoke = (index: number, search: unknown): unknown => {
        const middleware = middlewares[index]

        if (!middleware) {
            return finalNext(search)
        }

        return middleware({
            search,
            next: nextSearch => invoke(index + 1, nextSearch),
        })
    }

    return invoke(0, currentSearch)
}

describe('todo route search helpers', () => {
    it('normalizes invalid list search values', () => {
        expect(parseTodoListSearch({ filter: 'weird', q: '  route  ', sort: 'broken' })).toEqual({
            filter: 'all',
            q: 'route',
            sort: 'newest',
        })
    })

    it('normalizes detail search and preserves list state fields', () => {
        expect(parseTodoDetailSearch({ filter: 'active', panel: 'notes', q: ' ship ', sort: 'alpha' })).toEqual({
            filter: 'active',
            panel: 'notes',
            q: 'ship',
            sort: 'alpha',
        })

        expect(parseTodoDetailSearch({})).toEqual(defaultTodoDetailSearch)
    })

    it('picks list search state from broader search objects', () => {
        expect(
            pickTodoListSearch({
                filter: 'completed',
                panel: 'notes',
                q: 'done',
                sort: 'oldest',
            }),
        ).toEqual({
            filter: 'completed',
            q: 'done',
            sort: 'oldest',
        })
    })

    it('filters and sorts todos by route state', () => {
        expect(
            filterAndSortTodos(sampleTodos, {
                filter: 'active',
                q: 'alex',
                sort: 'alpha',
            }).map(todo => todo.id),
        ).toEqual(['3'])

        expect(
            filterAndSortTodos(sampleTodos, {
                filter: 'all',
                q: '',
                sort: 'oldest',
            }).map(todo => todo.id),
        ).toEqual(['2', '1', '3'])
    })

    it('retains list search when navigating to detail and strips default panel', () => {
        const result = applyMiddlewares(
            todoDetailSearchMiddlewares as Array<(ctx: { next: (search: unknown) => unknown; search: unknown }) => unknown>,
            { filter: 'active', q: 'ship', sort: 'oldest' },
            () => ({ ...defaultTodoDetailSearch, panel: 'notes' }),
        )

        expect(result).toEqual({
            filter: 'active',
            panel: 'notes',
            q: 'ship',
            sort: 'oldest',
        })
    })

    it('retains detail list state when navigating back to the list route', () => {
        const result = applyMiddlewares(
            todoListSearchMiddlewares as Array<(ctx: { next: (search: unknown) => unknown; search: unknown }) => unknown>,
            { filter: 'completed', panel: 'notes', q: 'ship', sort: 'alpha' },
            () => defaultTodoListSearch,
        )

        expect(result).toEqual({
            filter: 'completed',
            q: 'ship',
            sort: 'alpha',
        })
    })
})

describe('todo stats route helpers', () => {
    const context: TodoRouterContext = {
        appName: 'todo-bare',
        platform: 'bare',
    }

    it('normalizes stats search values', () => {
        expect(parseTodoStatsSearch({ filter: 'active', focus: 'completed', q: '  route ', sort: 'alpha', view: 'raw' })).toEqual({
            filter: 'active',
            focus: 'completed',
            q: 'route',
            sort: 'alpha',
            view: 'raw',
        })

        expect(parseTodoStatsSearch({})).toEqual(defaultTodoStatsSearch)
    })

    it('creates loader deps from typed stats search', () => {
        expect(
            createTodoStatsLoaderDeps({
                filter: 'active',
                focus: 'completed',
                q: 'demo',
                sort: 'oldest',
                view: 'raw',
            }),
        ).toEqual({
            filter: 'active',
            focus: 'completed',
            q: 'demo',
            sort: 'oldest',
            view: 'raw',
        })
    })

    it('builds route context from stats search and runtime context', () => {
        expect(buildTodoStatsRouteContext(defaultTodoStatsSearch, context)).toEqual({
            sectionTitle: 'Loader Summary for todo-bare',
            sectionTone: 'calm',
        })

        expect(buildTodoStatsRouteContext({ ...defaultTodoStatsSearch, view: 'raw' }, context)).toEqual({
            sectionTitle: 'Raw Loader Payload for todo-bare',
            sectionTone: 'debug',
        })
    })

    it('builds loader data from loader deps and router context', () => {
        expect(
            buildTodoStatsLoaderData(
                {
                    filter: 'completed',
                    focus: 'active',
                    q: 'ship',
                    sort: 'alpha',
                    view: 'summary',
                },
                context,
                '2026-03-28T10:00:00.000Z',
            ),
        ).toEqual({
            appName: 'todo-bare',
            cards: [
                { label: 'Filter', value: 'completed' },
                { label: 'Focus', value: 'active' },
                { label: 'Sort', value: 'alpha' },
                { label: 'Query', value: 'ship' },
            ],
            generatedAt: '2026-03-28T10:00:00.000Z',
            headline: 'Active todos snapshot',
            platform: 'bare',
            rawPayload: {
                context,
                deps: {
                    filter: 'completed',
                    focus: 'active',
                    q: 'ship',
                    sort: 'alpha',
                    view: 'summary',
                },
            },
            summary: 'Inspecting completed items with active todos on bare, sorted by alpha.',
        })
    })

    it('retains list search when navigating to stats and strips defaults', () => {
        const result = applyMiddlewares(
            todoStatsSearchMiddlewares as Array<(ctx: { next: (search: unknown) => unknown; search: unknown }) => unknown>,
            { filter: 'active', q: 'ship', sort: 'oldest' },
            () => ({ ...defaultTodoStatsSearch, focus: 'completed', view: 'raw' }),
        )

        expect(result).toEqual({
            filter: 'active',
            focus: 'completed',
            q: 'ship',
            sort: 'oldest',
            view: 'raw',
        })
    })
})

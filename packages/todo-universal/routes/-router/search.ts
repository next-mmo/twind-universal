import { retainSearchParams, stripSearchParams } from '@tanstack/react-router'
import type { Todo, TodoFilter } from '../-store/types'

export type TodoSort = 'newest' | 'oldest' | 'alpha'
export type TodoDetailPanel = 'summary' | 'notes'

export interface TodoListSearch {
    filter: TodoFilter
    q: string
    sort: TodoSort
}

export interface TodoDetailSearch {
    filter: TodoFilter
    panel: TodoDetailPanel
    q: string
    sort: TodoSort
}

export const defaultTodoListSearch: TodoListSearch = {
    filter: 'all',
    q: '',
    sort: 'newest',
}

export const defaultTodoDetailSearch: TodoDetailSearch = {
    ...defaultTodoListSearch,
    panel: 'summary',
}

const validFilters: TodoFilter[] = ['all', 'active', 'completed']
const validSorts: TodoSort[] = ['newest', 'oldest', 'alpha']
const validPanels: TodoDetailPanel[] = ['summary', 'notes']

function getStringValue(value: unknown) {
    return typeof value === 'string' ? value : ''
}

export function parseTodoListSearch(search: Record<string, unknown>): TodoListSearch {
    const filter = validFilters.includes(search.filter as TodoFilter) ? (search.filter as TodoFilter) : defaultTodoListSearch.filter
    const sort = validSorts.includes(search.sort as TodoSort) ? (search.sort as TodoSort) : defaultTodoListSearch.sort

    return {
        filter,
        q: getStringValue(search.q).trim(),
        sort,
    }
}

export function parseTodoDetailSearch(search: Record<string, unknown>): TodoDetailSearch {
    return {
        filter: validFilters.includes(search.filter as TodoFilter) ? (search.filter as TodoFilter) : defaultTodoDetailSearch.filter,
        panel: validPanels.includes(search.panel as TodoDetailPanel) ? (search.panel as TodoDetailPanel) : defaultTodoDetailSearch.panel,
        q: getStringValue(search.q).trim(),
        sort: validSorts.includes(search.sort as TodoSort) ? (search.sort as TodoSort) : defaultTodoDetailSearch.sort,
    }
}

export function pickTodoListSearch(search: {
    filter?: unknown
    q?: unknown
    sort?: unknown
}): TodoListSearch {
    return {
        filter: validFilters.includes(search.filter as TodoFilter) ? (search.filter as TodoFilter) : defaultTodoListSearch.filter,
        q: getStringValue(search.q).trim(),
        sort: validSorts.includes(search.sort as TodoSort) ? (search.sort as TodoSort) : defaultTodoListSearch.sort,
    }
}

export const todoListSearchMiddlewares = [
    retainSearchParams<TodoListSearch>(['filter', 'q', 'sort']),
    stripSearchParams<TodoListSearch>(defaultTodoListSearch),
]

export const todoDetailSearchMiddlewares = [
    retainSearchParams<TodoDetailSearch>(['filter', 'q', 'sort']),
    stripSearchParams<TodoDetailSearch>(defaultTodoDetailSearch),
]

export function filterAndSortTodos(todos: Todo[], search: TodoListSearch) {
    const query = search.q.toLowerCase()

    const visibleTodos = todos.filter(todo => {
        if (search.filter === 'active' && todo.completed) {
            return false
        }

        if (search.filter === 'completed' && !todo.completed) {
            return false
        }

        if (!query) {
            return true
        }

        return `${todo.text} ${todo.notes ?? ''}`.toLowerCase().includes(query)
    })

    return [...visibleTodos].sort((left, right) => {
        if (search.sort === 'alpha') {
            return left.text.localeCompare(right.text)
        }

        if (search.sort === 'oldest') {
            return left.createdAt - right.createdAt
        }

        return right.createdAt - left.createdAt
    })
}

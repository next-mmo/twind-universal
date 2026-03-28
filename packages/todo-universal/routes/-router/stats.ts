import { retainSearchParams, stripSearchParams } from '@tanstack/react-router'
import type { TodoFilter } from '../-store/types'
import type { TodoRouterContext } from './context'
import { defaultTodoListSearch, type TodoListSearch, type TodoSort } from './search'

export type TodoStatsFocus = 'all' | 'active' | 'completed'
export type TodoStatsView = 'summary' | 'raw'

export interface TodoStatsSearch extends TodoListSearch {
    focus: TodoStatsFocus
    view: TodoStatsView
}

export interface TodoStatsLoaderData {
    appName: string
    cards: Array<{ label: string; value: string }>
    generatedAt: string
    headline: string
    platform: TodoRouterContext['platform']
    rawPayload: {
        context: TodoRouterContext
        deps: TodoStatsLoaderDeps
    }
    summary: string
}

export interface TodoStatsLoaderDeps {
    filter: TodoFilter
    focus: TodoStatsFocus
    q: string
    sort: TodoSort
    view: TodoStatsView
}

export interface TodoStatsRouteContext {
    sectionTitle: string
    sectionTone: 'calm' | 'debug'
}

const validFocuses: TodoStatsFocus[] = ['all', 'active', 'completed']
const validViews: TodoStatsView[] = ['summary', 'raw']

const focusLabels: Record<TodoStatsFocus, string> = {
    all: 'All todos',
    active: 'Active todos',
    completed: 'Completed todos',
}

export const defaultTodoStatsSearch: TodoStatsSearch = {
    ...defaultTodoListSearch,
    focus: 'all',
    view: 'summary',
}

function getStringValue(value: unknown) {
    return typeof value === 'string' ? value : ''
}

export function parseTodoStatsSearch(search: Record<string, unknown>): TodoStatsSearch {
    return {
        filter: search.filter === 'active' || search.filter === 'completed' ? search.filter : defaultTodoStatsSearch.filter,
        focus: validFocuses.includes(search.focus as TodoStatsFocus) ? (search.focus as TodoStatsFocus) : defaultTodoStatsSearch.focus,
        q: getStringValue(search.q).trim(),
        sort: search.sort === 'oldest' || search.sort === 'alpha' ? search.sort : defaultTodoStatsSearch.sort,
        view: validViews.includes(search.view as TodoStatsView) ? (search.view as TodoStatsView) : defaultTodoStatsSearch.view,
    }
}

export function createTodoStatsLoaderDeps(search: TodoStatsSearch): TodoStatsLoaderDeps {
    return {
        filter: search.filter,
        focus: search.focus,
        q: search.q,
        sort: search.sort,
        view: search.view,
    }
}

export function buildTodoStatsRouteContext(search: TodoStatsSearch, context: TodoRouterContext): TodoStatsRouteContext {
    return {
        sectionTitle: search.view === 'raw' ? `Raw Loader Payload for ${context.appName}` : `Loader Summary for ${context.appName}`,
        sectionTone: search.view === 'raw' ? 'debug' : 'calm',
    }
}

export function buildTodoStatsLoaderData(
    deps: TodoStatsLoaderDeps,
    context: TodoRouterContext,
    now = new Date().toISOString(),
): TodoStatsLoaderData {
    return {
        appName: context.appName,
        cards: [
            { label: 'Filter', value: deps.filter },
            { label: 'Focus', value: deps.focus },
            { label: 'Sort', value: deps.sort },
            { label: 'Query', value: deps.q || 'none' },
        ],
        generatedAt: now,
        headline: `${focusLabels[deps.focus]} snapshot`,
        platform: context.platform,
        rawPayload: {
            context,
            deps,
        },
        summary: `Inspecting ${deps.filter} items with ${focusLabels[deps.focus].toLowerCase()} on ${context.platform}, sorted by ${deps.sort}.`,
    }
}

export const todoStatsSearchMiddlewares = [
    retainSearchParams<TodoStatsSearch>(['filter', 'q', 'sort']),
    stripSearchParams<TodoStatsSearch>(defaultTodoStatsSearch),
]

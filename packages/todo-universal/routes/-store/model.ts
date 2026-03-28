import type { Todo } from './types'

export interface TodoStats {
    total: number
    active: number
    completed: number
}

export const TODO_STORAGE_KEY = 'todo-universal.todos'

const demoTodoBlueprints = [
    {
        id: 'ship-stable-release',
        text: 'Ship stable release',
        completed: false,
        notes: 'Verify web + bare route parity before publishing the demo.',
        offset: 1_000,
    },
    {
        id: 'abstract-native-storage',
        text: 'Abstract native storage adapter',
        completed: false,
        notes: 'Keep native modules behind platform files instead of importing them in route files.',
        offset: 2_000,
    },
    {
        id: 'retire-legacy-filter-state',
        text: 'Retire legacy filter state',
        completed: true,
        notes: 'Route search params are the only filter source of truth now.',
        offset: 3_000,
    },
] as const

function isTodoRecord(value: unknown): value is Todo {
    if (!value || typeof value !== 'object') {
        return false
    }

    const todo = value as Partial<Todo>

    return typeof todo.id === 'string'
        && typeof todo.text === 'string'
        && typeof todo.completed === 'boolean'
        && typeof todo.createdAt === 'number'
        && (todo.notes === undefined || typeof todo.notes === 'string')
}

function normalizeTodo(todo: Todo): Todo {
    return {
        completed: todo.completed,
        createdAt: todo.createdAt,
        id: todo.id,
        notes: todo.notes?.trim() || undefined,
        text: todo.text.trim(),
    }
}

function createTodoId(now: number) {
    return `todo-${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

export function createDemoTodos(now = Date.now()): Todo[] {
    return demoTodoBlueprints.map(blueprint => ({
        completed: blueprint.completed,
        createdAt: now - blueprint.offset,
        id: blueprint.id,
        notes: blueprint.notes,
        text: blueprint.text,
    }))
}

export function parseStoredTodos(serialized: string | null): Todo[] | null {
    if (!serialized) {
        return null
    }

    try {
        const parsed = JSON.parse(serialized)

        if (!Array.isArray(parsed) || !parsed.every(isTodoRecord)) {
            return null
        }

        return parsed.map(normalizeTodo)
    } catch {
        return null
    }
}

export function getInitialTodos(serialized: string | null, now = Date.now()): Todo[] {
    return parseStoredTodos(serialized) ?? createDemoTodos(now)
}

export function serializeTodos(todos: Todo[]) {
    return JSON.stringify(todos.map(normalizeTodo))
}

export function addTodoToList(todos: Todo[], text: string, now = Date.now()): Todo[] {
    const trimmed = text.trim()

    if (!trimmed) {
        return todos
    }

    return [
        {
            completed: false,
            createdAt: now,
            id: createTodoId(now),
            text: trimmed,
        },
        ...todos,
    ]
}

export function toggleTodoInList(todos: Todo[], id: string): Todo[] {
    return todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
}

export function deleteTodoFromList(todos: Todo[], id: string): Todo[] {
    return todos.filter(todo => todo.id !== id)
}

export function updateTodoInList(todos: Todo[], id: string, updates: Partial<Todo>): Todo[] {
    return todos.map(todo => (todo.id === id ? normalizeTodo({ ...todo, ...updates }) : todo))
}

export function clearCompletedTodos(todos: Todo[]): Todo[] {
    return todos.filter(todo => !todo.completed)
}

export function getTodoById(todos: Todo[], id: string) {
    return todos.find(todo => todo.id === id)
}

export function getTodoStats(todos: Todo[]): TodoStats {
    const completed = todos.filter(todo => todo.completed).length

    return {
        active: todos.length - completed,
        completed,
        total: todos.length,
    }
}

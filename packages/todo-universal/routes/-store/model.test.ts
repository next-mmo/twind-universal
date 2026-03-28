import { describe, expect, it } from 'vitest'
import {
    TODO_STORAGE_KEY,
    addTodoToList,
    clearCompletedTodos,
    createDemoTodos,
    deleteTodoFromList,
    getInitialTodos,
    getTodoById,
    getTodoStats,
    parseStoredTodos,
    serializeTodos,
    toggleTodoInList,
    updateTodoInList,
} from './model'

describe('todo store model', () => {
    it('creates seeded demo todos in newest-first order', () => {
        const todos = createDemoTodos(10_000)

        expect(todos.map(todo => todo.id)).toEqual([
            'ship-stable-release',
            'abstract-native-storage',
            'retire-legacy-filter-state',
        ])
        expect(todos[0]?.createdAt).toBeGreaterThan(todos[1]?.createdAt ?? 0)
    })

    it('falls back to demo todos when no persisted state exists', () => {
        const todos = getInitialTodos(null, 20_000)

        expect(todos).toHaveLength(3)
        expect(todos[0]?.id).toBe('ship-stable-release')
    })

    it('round-trips valid persisted todos and rejects invalid payloads', () => {
        const serialized = serializeTodos(createDemoTodos(30_000))

        expect(parseStoredTodos(serialized)?.map(todo => todo.id)).toEqual([
            'ship-stable-release',
            'abstract-native-storage',
            'retire-legacy-filter-state',
        ])
        expect(parseStoredTodos('{"broken":true}')).toBeNull()
        expect(parseStoredTodos('[{"id":1}]')).toBeNull()
    })

    it('adds todos with trimmed text and ignores blank input', () => {
        const todos = addTodoToList(createDemoTodos(40_000), '  Verify final demo  ', 50_000)

        expect(todos[0]?.text).toBe('Verify final demo')
        expect(addTodoToList(todos, '   ', 60_000)).toEqual(todos)
    })

    it('toggles, updates, and deletes todos by id', () => {
        const todos = createDemoTodos(70_000)
        const toggled = toggleTodoInList(todos, 'ship-stable-release')
        const updated = updateTodoInList(toggled, 'abstract-native-storage', {
            notes: '  Keep this deterministic for tests.  ',
            text: '  Abstract native storage adapter safely ',
        })
        const deleted = deleteTodoFromList(updated, 'retire-legacy-filter-state')

        expect(getTodoById(toggled, 'ship-stable-release')?.completed).toBe(true)
        expect(getTodoById(updated, 'abstract-native-storage')).toMatchObject({
            notes: 'Keep this deterministic for tests.',
            text: 'Abstract native storage adapter safely',
        })
        expect(deleted.map(todo => todo.id)).toEqual([
            'ship-stable-release',
            'abstract-native-storage',
        ])
    })

    it('clears completed todos and computes stats', () => {
        const todos = createDemoTodos(80_000)
        const cleared = clearCompletedTodos(todos)

        expect(cleared.map(todo => todo.id)).toEqual([
            'ship-stable-release',
            'abstract-native-storage',
        ])
        expect(getTodoStats(todos)).toEqual({
            active: 2,
            completed: 1,
            total: 3,
        })
    })

    it('uses a stable storage key for persisted demo state', () => {
        expect(TODO_STORAGE_KEY).toBe('todo-universal.todos')
    })
})

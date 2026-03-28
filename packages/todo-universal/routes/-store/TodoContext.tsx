import { createContext, type ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { todoStorage } from '../-platform/storage'
import {
    TODO_STORAGE_KEY,
    addTodoToList,
    clearCompletedTodos,
    createDemoTodos,
    deleteTodoFromList,
    getInitialTodos,
    getTodoById,
    getTodoStats,
    serializeTodos,
    toggleTodoInList,
    updateTodoInList,
} from './model'
import type { Todo } from './types'

interface TodoContextValue {
    todos: Todo[]
    addTodo: (text: string) => void
    clearCompleted: () => void
    deleteTodo: (id: string) => void
    getTodo: (id: string) => Todo | undefined
    resetDemo: () => void
    storageMode: typeof todoStorage.kind
    stats: ReturnType<typeof getTodoStats>
    toggleTodo: (id: string) => void
    updateTodo: (id: string, updates: Partial<Todo>) => void
}

const TodoContext = createContext<TodoContextValue | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useState<Todo[]>(() => getInitialTodos(todoStorage.load(TODO_STORAGE_KEY)))

    useEffect(() => {
        try {
            todoStorage.save(TODO_STORAGE_KEY, serializeTodos(todos))
        } catch (error) {
            if (typeof console !== 'undefined') {
                console.error('Failed to save todos', error)
            }
        }
    }, [todos])

    const addTodo = useCallback((text: string) => {
        setTodos(prev => addTodoToList(prev, text))
    }, [])

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => toggleTodoInList(prev, id))
    }, [])

    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => deleteTodoFromList(prev, id))
    }, [])

    const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
        setTodos(prev => updateTodoInList(prev, id, updates))
    }, [])

    const clearCompleted = useCallback(() => {
        setTodos(prev => clearCompletedTodos(prev))
    }, [])

    const resetDemo = useCallback(() => {
        setTodos(createDemoTodos())
    }, [])

    const getTodo = useCallback((id: string) => getTodoById(todos, id), [todos])

    const stats = useMemo(() => getTodoStats(todos), [todos])

    return (
        <TodoContext.Provider
            value={{
                addTodo,
                clearCompleted,
                deleteTodo,
                getTodo,
                resetDemo,
                stats,
                storageMode: todoStorage.kind,
                todos,
                toggleTodo,
                updateTodo,
            }}
        >
            {children}
        </TodoContext.Provider>
    )
}

export function useTodos() {
    const ctx = useContext(TodoContext)
    if (!ctx) throw new Error('useTodos must be used within a TodoProvider')
    return ctx
}

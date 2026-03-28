import { createContext, type ReactNode, useCallback, useContext, useState, useEffect } from 'react'
import type { Todo, TodoFilter } from './types'

interface TodoContextValue {
    todos: Todo[]
    filteredTodos: Todo[]
    filter: TodoFilter
    setFilter: (f: TodoFilter) => void
    addTodo: (text: string) => void
    toggleTodo: (id: string) => void
    deleteTodo: (id: string) => void
    updateTodo: (id: string, updates: Partial<Todo>) => void
    clearCompleted: () => void
    getTodo: (id: string) => Todo | undefined
    stats: { total: number; active: number; completed: number }
}

const TodoContext = createContext<TodoContextValue | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
    const [todos, setTodos] = useState<Todo[]>(() => {
        if (typeof localStorage !== 'undefined') {
            try {
                const saved = localStorage.getItem('todos')
                if (saved) return JSON.parse(saved)
            } catch (e) {
                console.error('Failed to load todos', e)
            }
        }
        return []
    })
    const [filter, setFilter] = useState<TodoFilter>('all')

    useEffect(() => {
        if (typeof localStorage !== 'undefined') {
            try {
                localStorage.setItem('todos', JSON.stringify(todos))
            } catch (e) {
                console.error('Failed to save todos', e)
            }
        }
    }, [todos])

    const addTodo = useCallback((text: string) => {
        const trimmed = text.trim()
        if (!trimmed) return

        setTodos(prev => [
            {
                id: Date.now().toString(),
                text: trimmed,
                completed: false,
                createdAt: Date.now(),
            },
            ...prev,
        ])
    }, [])

    const toggleTodo = useCallback((id: string) => {
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
    }, [])

    const deleteTodo = useCallback((id: string) => {
        setTodos(prev => prev.filter(t => t.id !== id))
    }, [])

    const updateTodo = useCallback((id: string, updates: Partial<Todo>) => {
        setTodos(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)))
    }, [])

    const clearCompleted = useCallback(() => {
        setTodos(prev => prev.filter(t => !t.completed))
    }, [])

    const getTodo = useCallback(
        (id: string) => {
            return todos.find(t => t.id === id)
        },
        [todos],
    )

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed
        if (filter === 'completed') return todo.completed
        return true
    })

    const stats = {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length,
    }

    return (
        <TodoContext.Provider
            value={{
                todos,
                filteredTodos,
                filter,
                setFilter,
                addTodo,
                toggleTodo,
                deleteTodo,
                updateTodo,
                clearCompleted,
                getTodo,
                stats,
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

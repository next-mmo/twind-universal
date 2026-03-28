export interface Todo {
    id: string
    text: string
    completed: boolean
    createdAt: number
    notes?: string
}

export type TodoFilter = 'all' | 'active' | 'completed'

import { Uniwind, useUniwind, Pressable, ScrollView, Text, View } from 'uniwind-ui'
import { TodoFilter } from '../features/todo/components/TodoFilter'
import { TodoInput } from '../features/todo/components/TodoInput'
import { TodoItem } from '../features/todo/components/TodoItem'
import { useTodos } from '../features/todo/TodoContext'

export function TodoListScreen() {
    const { theme } = useUniwind()
    const { filteredTodos, filter, setFilter, addTodo, toggleTodo, clearCompleted, stats } = useTodos()

    return (
        <View className="flex-1 bg-white dark:bg-zinc-950">
            {/* Header */}
            <View className="px-5 pt-14 pb-4 bg-indigo-500">
                <Text className="text-3xl font-bold text-white">Todos</Text>
                <Text className="text-indigo-200 text-sm mt-1">
                    {stats.active} item{stats.active !== 1 ? 's' : ''} left
                </Text>
            </View>

            {/* Input */}
            <TodoInput onAdd={addTodo} />

            {/* Filters */}
            <TodoFilter filter={filter} onFilterChange={setFilter} stats={stats} />

            {/* List */}
            <ScrollView className="flex-1">
                {filteredTodos.length === 0 ? (
                    <View className="items-center py-16">
                        <Text className="text-zinc-400 dark:text-zinc-600 text-lg">
                            {filter === 'all' ? 'No todos yet. Add one above!' : `No ${filter} todos`}
                        </Text>
                    </View>
                ) : (
                    filteredTodos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />)
                )}
            </ScrollView>

            {/* Footer */}
            <View className="px-5 py-3 flex-row justify-between items-center border-t border-zinc-200 dark:border-zinc-800">
                <Pressable onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Text className="text-zinc-500 text-sm">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</Text>
                </Pressable>
                {stats.completed > 0 ? (
                    <Pressable onPress={clearCompleted}>
                        <Text className="text-red-500 text-sm font-medium">Clear completed ({stats.completed})</Text>
                    </Pressable>
                ) : null}
            </View>
        </View>
    )
}

import { Pressable, ScrollView, Text, TextInput, View } from 'ui/primitives'
import { Uniwind, useUniwind } from 'ui/uniwind'
import { Link } from 'uniwind-router'
import { RouteFeatureTabs } from '../-components/RouteFeatureTabs'
import { TodoFilter } from '../-components/TodoFilter'
import { TodoInput } from '../-components/TodoInput'
import { TodoItem } from '../-components/TodoItem'
import { useLayoutInsets } from '../-hooks/useLayoutInsets'
import { todoListRouteApi } from '../-router/api'
import type { TodoListSearch, TodoSort } from '../-router/search'
import { defaultTodoListSearch, filterAndSortTodos } from '../-router/search'
import { defaultTodoStatsSearch } from '../-router/stats'
import { useTodos } from '../-store/TodoContext'

const sortOptions: Array<{ key: TodoSort; label: string }> = [
    { key: 'newest', label: 'Newest' },
    { key: 'oldest', label: 'Oldest' },
    { key: 'alpha', label: 'A-Z' },
]

export function TodoListView() {
    const insets = useLayoutInsets()
    const { theme } = useUniwind()
    const navigate = todoListRouteApi.useNavigate()
    const search = todoListRouteApi.useSearch()
    const { todos, addTodo, toggleTodo, clearCompleted, resetDemo, stats, storageMode } = useTodos()
    const visibleTodos = filterAndSortTodos(todos, search)
    const statsSearch = { ...defaultTodoStatsSearch, ...search }

    const updateSearch = (patch: Partial<TodoListSearch>) => {
        navigate({
            to: '/',
            search: { ...defaultTodoListSearch, ...search, ...patch },
            replace: true,
        })
    }

    return (
        <View className="flex-1 bg-white dark:bg-zinc-950">
            <View className="px-5 pb-4 bg-indigo-500" style={{ paddingTop: insets.top + 16 }}>
                <Text className="text-3xl font-bold text-white">Todos</Text>
                <Text className="text-indigo-200 text-sm mt-1">
                    {stats.active} item{stats.active !== 1 ? 's' : ''} left
                </Text>
            </View>

            <View className="bg-indigo-500">
                <RouteFeatureTabs listSearch={search} statsSearch={statsSearch} />
            </View>

            <TodoInput onAdd={addTodo} />

            <View className="px-5 py-3 gap-3 border-b border-zinc-200 dark:border-zinc-800">
                <TextInput
                    className="bg-zinc-100 dark:bg-zinc-800 rounded-xl px-4 py-3 text-base text-zinc-900 dark:text-zinc-100"
                    placeholder="Search from route query params"
                    placeholderTextColor="#a1a1aa"
                    value={search.q}
                    onChangeText={(value: string) => updateSearch({ q: value })}
                />
                <View className="flex-row flex-wrap gap-2">
                    {sortOptions.map(option => {
                        const active = search.sort === option.key

                        return (
                            <Pressable
                                key={option.key}
                                className={`px-4 py-2 rounded-lg ${active ? 'bg-indigo-500' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                                onPress={() => updateSearch({ sort: option.key })}
                            >
                                <Text className={`text-sm font-medium ${active ? 'text-white' : 'text-zinc-600 dark:text-zinc-400'}`}>
                                    {option.label}
                                </Text>
                            </Pressable>
                        )
                    })}
                </View>
                <View className="flex-row flex-wrap gap-3">
                    <Link to="/" search={{ filter: 'active', q: '', sort: 'newest' }}>
                        <Text className="text-indigo-500 text-sm font-medium">Active demo</Text>
                    </Link>
                    <Link to="/" search={{ filter: 'completed', q: '', sort: 'alpha' }}>
                        <Text className="text-indigo-500 text-sm font-medium">Completed A-Z</Text>
                    </Link>
                    <Link to="/todo/stats" search={{ ...statsSearch, focus: search.filter, view: 'summary' }}>
                        <Text className="text-indigo-500 text-sm font-medium">Loader stats</Text>
                    </Link>
                    <Link to="/" search={defaultTodoListSearch as any}>
                        <Text className="text-zinc-500 dark:text-zinc-400 text-sm">Reset route state</Text>
                    </Link>
                </View>
            </View>

            <TodoFilter filter={search.filter} onFilterChange={filter => updateSearch({ filter })} stats={stats} />

            <ScrollView className="flex-1">
                {visibleTodos.length === 0 ? (
                    <View className="items-center py-16 px-6">
                        <Text className="text-zinc-400 dark:text-zinc-600 text-lg text-center">
                            {search.q
                                ? `No todos matching "${search.q}"`
                                : search.filter === 'all'
                                  ? 'No todos yet. Add one above!'
                                  : `No ${search.filter} todos`}
                        </Text>
                    </View>
                ) : (
                    visibleTodos.map(todo => <TodoItem key={todo.id} todo={todo} onToggle={toggleTodo} />)
                )}
            </ScrollView>

            <View
                className="px-5 py-3 flex-row justify-between items-center border-t border-zinc-200 dark:border-zinc-800"
                style={{ paddingBottom: insets.bottom + 12 }}
            >
                <Pressable onPress={() => Uniwind.setTheme(theme === 'dark' ? 'light' : 'dark')}>
                    <Text className="text-zinc-500 text-sm">{theme === 'dark' ? '☀️ Light' : '🌙 Dark'}</Text>
                </Pressable>
                <View className="flex-row items-center gap-4">
                    <Pressable onPress={resetDemo}>
                        <Text className="text-indigo-500 text-sm font-medium">Reset demo</Text>
                    </Pressable>
                    {stats.completed > 0 ? (
                        <Pressable onPress={clearCompleted}>
                            <Text className="text-red-500 text-sm font-medium">Clear completed ({stats.completed})</Text>
                        </Pressable>
                    ) : null}
                </View>
            </View>
            <View className="px-5 pb-4">
                <Text className="text-xs text-zinc-400 dark:text-zinc-600">
                    Typed route search: filter={search.filter}, q={search.q || '""'}, sort={search.sort}, storage={storageMode}
                </Text>
            </View>
        </View>
    )
}
